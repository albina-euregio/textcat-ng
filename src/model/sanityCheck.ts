import { Lang } from "./language";
import {
  CurlyName,
  FULL_STOP,
  Phrase,
  SECOND_ITEM_PART_NO_SUFFIX,
} from "./phrase";
import { isSentence } from "./sentence";
import { TextCatalogue } from "./textCatalogue";

/**
 * Sanity checks for the Satzkatalog, see AGENTS.md of the satzkatalog repository.
 *
 * Contract: a written text stores {curlyName, line index, args keyed by curlyName}
 * and the same line index is used for every language.
 */

export type Severity = "error" | "warning" | "info";

export interface Issue {
  severity: Severity;
  code: string;
  lang: Lang | "*";
  curlyName: CurlyName;
  /** 0-based line index */
  line?: number;
  message: string;
}

export type Catalogues = Partial<Record<Lang, TextCatalogue>>;

const REFERENCE = /{([^{}]+)}/g;

export function references(line: string): CurlyName[] {
  return [...line.matchAll(REFERENCE)].map((m) => m[1]);
}

/** references with the `_NO` second-part suffix stripped, deduplicated and sorted */
function normalizedReferences(line: string): string {
  return [
    ...new Set(
      references(line)
        .filter((r) => r !== "Punkt")
        .map((r) => r.replace(/_NO$/, "")),
    ),
  ]
    .sort()
    .join(" ");
}

/** the literal text of a line, i.e. without references and special tokens */
function literalText(line: string): string {
  return line
    .replace(REFERENCE, " ")
    .replace(/\[Empty\]|\(--?\)/g, " ")
    .replace(/[\s.,:;!?()-]+/g, " ")
    .trim();
}

function hasWords(line: string): boolean {
  return /\p{L}{3,}/u.test(literalText(line));
}

function allPhrases(catalog: TextCatalogue): Phrase[] {
  return [...catalog.phrases, ...catalog.sentences];
}

function issue(
  severity: Severity,
  code: string,
  lang: Lang | "*",
  curlyName: CurlyName,
  message: string,
  line?: number,
): Issue {
  return { severity, code, lang, curlyName, line, message };
}

/** Checks a single language. */
export function checkCatalogue(catalog: TextCatalogue): Issue[] {
  const { lang } = catalog;
  const issues: Issue[] = [];

  for (const { curlyName, source } of catalog.duplicates) {
    issues.push(
      issue(
        "error",
        "duplicate-curlyname",
        lang,
        curlyName,
        `defined more than once (last definition wins)${source ? `, again in ${source}` : ""}`,
      ),
    );
  }

  const referenced = new Set<CurlyName>(
    allPhrases(catalog).flatMap((p) =>
      p.lines.flatMap(({ line }) => references(line)),
    ),
  );

  for (const phrase of allPhrases(catalog)) {
    const { curlyName } = phrase;
    if (!isSentence(phrase) && phrase.lines.length === 0) {
      issues.push(
        referenced.has(curlyName)
          ? issue(
              "error",
              "no-lines",
              lang,
              curlyName,
              "is used, but has no lines",
            )
          : issue(
              "info",
              "no-lines",
              lang,
              curlyName,
              "unused and has no lines",
            ),
      );
    }
    phrase.lines.forEach(({ line }, index) => {
      if ((line.match(/{/g) ?? []).length !== (line.match(/}/g) ?? []).length) {
        issues.push(
          issue(
            "error",
            "unbalanced-braces",
            lang,
            curlyName,
            `unbalanced braces: ${line}`,
            index,
          ),
        );
      }
      for (const ref of references(line)) {
        if (!catalog.phrase(ref)) {
          issues.push(
            issue(
              "error",
              "unknown-reference",
              lang,
              curlyName,
              `references unknown {${ref}}`,
              index,
            ),
          );
        }
        if (ref.endsWith(SECOND_ITEM_PART_NO_SUFFIX)) {
          const first = ref.slice(0, -SECOND_ITEM_PART_NO_SUFFIX.length);
          if (!references(line).includes(first)) {
            issues.push(
              issue(
                "warning",
                "orphan-second-part",
                lang,
                curlyName,
                `{${ref}} is used without {${first}} in the same line`,
                index,
              ),
            );
          }
        }
      }
      if (/\S {2,}\S/.test(line)) {
        issues.push(
          issue(
            "warning",
            "double-space",
            lang,
            curlyName,
            `double space: ${line}`,
            index,
          ),
        );
      }
    });

    // X_NO must align with X
    if (phrase.curlyName.endsWith(SECOND_ITEM_PART_NO_SUFFIX)) {
      const first = catalog.phrase(
        curlyName.slice(0, -SECOND_ITEM_PART_NO_SUFFIX.length),
      );
      if (!first) {
        issues.push(
          issue(
            "error",
            "second-part-without-first",
            lang,
            curlyName,
            "no corresponding first part phrase",
          ),
        );
      } else if (
        first.lines.length !== phrase.lines.length &&
        phrase.lines.length > 1
      ) {
        issues.push(
          issue(
            "error",
            "second-part-line-count",
            lang,
            curlyName,
            `has ${phrase.lines.length} lines, but ${first.curlyName} has ${first.lines.length}`,
          ),
        );
      }
    }
  }
  return issues;
}

/** Checks the consistency of all languages against the reference language (DE). */
export function checkCatalogues(
  catalogs: Catalogues,
  referenceLang: Lang = "de",
): Issue[] {
  const issues: Issue[] = [];
  const reference = catalogs[referenceLang];
  for (const catalog of Object.values(catalogs)) {
    issues.push(...checkCatalogue(catalog));
  }
  if (!reference) return issues;

  // unreachable phrases (reference language only)
  const reachable = new Set<CurlyName>();
  const visit = (curlyName: CurlyName) => {
    if (reachable.has(curlyName)) return;
    reachable.add(curlyName);
    reference
      .phrase(curlyName)
      ?.lines.forEach(({ line }) => references(line).forEach(visit));
  };
  reference.sentences.forEach((s) => visit(s.curlyName));
  visit(FULL_STOP.slice(1, -1));
  for (const phrase of reference.phrases) {
    if (!reachable.has(phrase.curlyName)) {
      issues.push(
        issue(
          "info",
          "unreachable",
          referenceLang,
          phrase.curlyName,
          "not reachable from any sentence",
        ),
      );
    }
  }

  for (const catalog of Object.values(catalogs)) {
    const { lang } = catalog;
    if (lang === referenceLang) continue;

    for (const sentence of reference.sentences) {
      if (!catalog.sentence(sentence.curlyName)) {
        issues.push(
          issue(
            "warning",
            "missing-sentence",
            lang,
            sentence.curlyName,
            `sentence exists in ${referenceLang} but not in ${lang}`,
          ),
        );
      }
    }

    for (const phrase of allPhrases(catalog)) {
      const { curlyName } = phrase;
      const ref = reference.phrase(curlyName);
      if (!ref) continue;
      if (isSentence(phrase)) {
        const a = normalizedReferences(ref.lines[0]?.line ?? "");
        const b = normalizedReferences(phrase.lines[0]?.line ?? "");
        if (a !== b) {
          issues.push(
            issue(
              "warning",
              "sentence-slots",
              lang,
              curlyName,
              `slots differ from ${referenceLang}: ${b} ≠ ${a}`,
            ),
          );
        }
        continue;
      }
      if (ref.lines.length !== phrase.lines.length) {
        issues.push(
          issue(
            "error",
            "line-count",
            lang,
            curlyName,
            `has ${phrase.lines.length} lines, but ${referenceLang} has ${ref.lines.length}`,
          ),
        );
        continue;
      }
      let untranslated = 0;
      let placeholder = 0;
      const regionMismatches: number[] = [];
      const second = catalog.phrase(curlyName + SECOND_ITEM_PART_NO_SUFFIX);
      const refSecond = reference.phrase(
        curlyName + SECOND_ITEM_PART_NO_SUFFIX,
      );
      const italian = catalogs.it?.phrase(curlyName);
      const refIndex = new Map<string, number>();
      ref.lines.forEach(({ line }, index) =>
        refIndex.set(line, refIndex.has(line) ? -1 : index),
      );
      phrase.lines.forEach(({ line, region }, index) => {
        const refLine = ref.lines[index];
        const elsewhere = refIndex.get(line) ?? -1;
        if (
          elsewhere >= 0 &&
          elsewhere !== index &&
          hasWords(line) &&
          // swapped: the other line holds the reference text of this index
          phrase.lines[elsewhere]?.line === refLine.line
        ) {
          issues.push(
            issue(
              "error",
              "misaligned-line",
              lang,
              curlyName,
              `"${line}" is swapped with index ${elsewhere} compared to ${referenceLang}`,
              index,
            ),
          );
        }
        if ((refLine.region ?? "") !== (region ?? "")) {
          regionMismatches.push(index);
        }
        const a = normalizedReferences(
          refLine.line + " " + (refSecond?.lines[index]?.line ?? ""),
        );
        const b = normalizedReferences(
          line + " " + (second?.lines[index]?.line ?? ""),
        );
        if (a !== b) {
          issues.push(
            issue(
              "warning",
              "line-references",
              lang,
              curlyName,
              `references differ from ${referenceLang}: {${b}} ≠ {${a}}`,
              index,
            ),
          );
        }
        if (hasWords(line) && line === refLine.line) {
          untranslated++;
        } else if (
          lang !== "it" &&
          hasWords(line) &&
          line === italian?.lines[index]?.line
        ) {
          placeholder++;
        }
      });
      if (regionMismatches.length) {
        const [index] = regionMismatches;
        issues.push(
          issue(
            "error",
            "region",
            lang,
            curlyName,
            `${regionMismatches.length} lines in a different region than in ${referenceLang}, first: ` +
              `${phrase.lines[index].region ?? "(none)"} ≠ ${ref.lines[index].region ?? "(none)"}`,
            index,
          ),
        );
      }
      if (untranslated) {
        issues.push(
          issue(
            "warning",
            "untranslated",
            lang,
            curlyName,
            `${untranslated} of ${phrase.lines.length} lines are identical to ${referenceLang}`,
          ),
        );
      }
      if (placeholder) {
        issues.push(
          issue(
            "info",
            "italian-placeholder",
            lang,
            curlyName,
            `${placeholder} of ${phrase.lines.length} lines are identical to it`,
          ),
        );
      }
    }
  }
  return issues;
}

/**
 * Compares two versions of the catalogue for changes that break saved written texts
 * (removed sentences/phrases, removed or shifted lines).
 */
export function compareCatalogues(
  oldCatalogs: Catalogues,
  newCatalogs: Catalogues,
): Issue[] {
  const issues: Issue[] = [];
  for (const oldCatalog of Object.values(oldCatalogs)) {
    const { lang } = oldCatalog;
    const newCatalog = newCatalogs[lang];
    if (!newCatalog) continue;
    for (const oldPhrase of allPhrases(oldCatalog)) {
      const { curlyName } = oldPhrase;
      const kind = isSentence(oldPhrase) ? "sentence" : "phrase";
      const newPhrase = newCatalog.phrase(curlyName);
      if (!newPhrase) {
        issues.push(
          issue(
            "error",
            `removed-${kind}`,
            lang,
            curlyName,
            `${kind} was removed`,
          ),
        );
        continue;
      }
      if (isSentence(oldPhrase)) {
        const a = references(oldPhrase.lines[0]?.line ?? "");
        const b = references(newPhrase.lines[0]?.line ?? "");
        const removed = a.filter((r) => !b.includes(r));
        if (removed.length) {
          issues.push(
            issue(
              "warning",
              "removed-slot",
              lang,
              curlyName,
              `slots removed: {${removed.join("} {")}}`,
            ),
          );
        }
        continue;
      }
      const oldLines = oldPhrase.lines.map((l) => l.line);
      const newLines = newPhrase.lines.map((l) => l.line);
      if (newLines.length < oldLines.length) {
        issues.push(
          issue(
            "error",
            "removed-lines",
            lang,
            curlyName,
            `line count decreased from ${oldLines.length} to ${newLines.length}`,
          ),
        );
      }
      const changed = oldLines.filter(
        (line, index) => index < newLines.length && newLines[index] !== line,
      ).length;
      if (changed) {
        issues.push(
          issue(
            "info",
            "changed-lines",
            lang,
            curlyName,
            `${changed} of ${oldLines.length} lines changed in place`,
          ),
        );
      }
      // a line of the old version that now lives at a different index
      for (let index = 0; index < oldLines.length; index++) {
        const line = oldLines[index];
        if (newLines[index] === line) continue;
        const newIndex = newLines.indexOf(line);
        const unique = (lines: string[]) =>
          lines.indexOf(line) === lines.lastIndexOf(line);
        if (newIndex >= 0 && unique(oldLines) && unique(newLines)) {
          issues.push(
            issue(
              "error",
              "shifted-lines",
              lang,
              curlyName,
              `line moved from index ${index} to ${newIndex}: ${line}`,
              index,
            ),
          );
          break; // report only the first shift per phrase
        }
      }
    }
  }
  return issues;
}

export function formatIssue(i: Issue): string {
  const where = i.line === undefined ? i.curlyName : `${i.curlyName}:${i.line}`;
  return `${i.severity.padEnd(7)} ${i.code.padEnd(26)} ${i.lang} ${where} – ${i.message}`;
}
