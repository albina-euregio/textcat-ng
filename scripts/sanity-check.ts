/// <reference types="node" />
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { Lang } from "../src/model/language";
import {
  Catalogues,
  checkCatalogues,
  compareCatalogues,
  formatIssue,
  Issue,
} from "../src/model/sanityCheck";
import { TextCatalogue } from "../src/model/textCatalogue";

const LANGS: Lang[] = ["ca", "de", "en", "es", "fr", "it", "oc"];

function listFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".txt"))
    .map((e) => join(e.parentPath, e.name))
    .sort();
}

/** Loads `<satzkatalog>` or `<satzkatalog>#<git-rev>` (via git archive). */
export function loadCatalogues(spec: string): Catalogues {
  const [repo, rev] = spec.split("#", 2);
  let dataDir = join(repo, "data");
  let tmp: string | undefined;
  if (rev) {
    tmp = mkdtempSync(join(tmpdir(), "satzkatalog-"));
    const tar = execFileSync("git", ["-C", repo, "archive", rev, "data"], {
      maxBuffer: 1 << 30,
    });
    execFileSync("tar", ["-x", "-C", tmp], { input: tar });
    dataDir = join(tmp, "data");
  }
  try {
    const catalogs: Catalogues = {};
    for (const lang of LANGS) {
      const langDir = join(dataDir, lang.toUpperCase());
      const catalog = new TextCatalogue(lang);
      for (const file of listFiles(langDir)) {
        // same normalization as build-textfiles.py
        const text = readFileSync(file, "utf-8")
          .replace(/^﻿/, "")
          .replace(/^Line: (Begin|End): /gm, "$1: ");
        catalog.parse(text, relative(dataDir, file));
      }
      catalogs[lang] = catalog;
    }
    return catalogs;
  } finally {
    if (tmp) rmSync(tmp, { recursive: true, force: true });
  }
}

const key = (i: Issue) => `${i.code}|${i.lang}|${i.curlyName}|${i.message}`;

export function main(argv: string[]): number {
  const json = argv.includes("--json");
  const all = argv.includes("--all");
  const quiet = argv.includes("--quiet");
  const [newSpec, oldSpec] = argv.filter((a) => !a.startsWith("--"));
  if (!newSpec) {
    console.error(
      "Usage: sanity-check [--json] [--all] [--quiet] <satzkatalog>[#rev] [<old-satzkatalog>[#rev]]\n" +
        "  with <old>: reports breaking changes old→new and only issues new since old (unless --all)\n" +
        "  --quiet: hide info-level issues",
    );
    return 2;
  }
  const newCatalogs = loadCatalogues(newSpec);
  let issues = checkCatalogues(newCatalogs);
  if (oldSpec) {
    const oldCatalogs = loadCatalogues(oldSpec);
    if (!all) {
      const old = new Set(checkCatalogues(oldCatalogs).map(key));
      issues = issues.filter((i) => !old.has(key(i)));
    }
    issues = [...compareCatalogues(oldCatalogs, newCatalogs), ...issues];
  }
  if (quiet) issues = issues.filter((i) => i.severity !== "info");
  if (json) {
    console.log(JSON.stringify(issues, undefined, 2));
  } else {
    issues.forEach((i) => console.log(formatIssue(i)));
    const count = (s: string) => issues.filter((i) => i.severity === s).length;
    console.error(
      `${count("error")} errors, ${count("warning")} warnings, ${count("info")} infos`,
    );
  }
  return issues.some((i) => i.severity === "error") ? 1 : 0;
}
