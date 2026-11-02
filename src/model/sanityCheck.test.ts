import { Lang } from "./language";
import { checkCatalogues, compareCatalogues, Issue } from "./sanityCheck";
import { TextCatalogue } from "./textCatalogue";
import { expect, it } from "vite-plus/test";

function catalog(lang: Lang, text: string): TextCatalogue {
  return new TextCatalogue(lang).parse(text, `${lang}.txt`);
}

const codes = (issues: Issue[]) =>
  issues
    .filter((i) => i.severity !== "info")
    .map((i) => `${i.code}:${i.lang}:${i.curlyName}`)
    .sort();

const DE = `
ST_Header: S
ST_CurlyName: S
RS_CurlyName: foo

RS_Header: foo
RS_CurlyName: foo
Line: [Empty]
Line: viel {bar}
Line: wenig {bar}

RS_Header: bar
RS_CurlyName: bar
Line: Schnee
`;

it("accepts a consistent catalogue", () => {
  const it_ = catalog(
    "it",
    DE.replace("viel", "molto")
      .replace("wenig", "poco")
      .replace("Schnee", "neve"),
  );
  expect(checkCatalogues({ de: catalog("de", DE), it: it_ })).toEqual([]);
});

it("detects unknown references, duplicates, line count and untranslated lines", () => {
  const de = catalog("de", DE);
  de.parse("RS_Header: bar\nRS_CurlyName: bar\nLine: Regen", "dup.txt");
  const it_ = catalog(
    "it",
    `${DE.replace("Line: wenig {bar}\n", "")}\nRS_Header: x\nRS_CurlyName: x\nLine: {missing}`,
  );
  expect(codes(checkCatalogues({ de, it: it_ }))).toEqual([
    "duplicate-curlyname:de:bar",
    "line-count:it:foo",
    "unknown-reference:it:x",
  ]);
  const untranslated = catalog("it", DE);
  expect(
    codes(checkCatalogues({ de: catalog("de", DE), it: untranslated })),
  ).toEqual(["untranslated:it:bar", "untranslated:it:foo"]);
});

it("checks _NO second parts", () => {
  const de = catalog(
    "de",
    `${DE}\nRS_Header: bar\nRS_CurlyName: bar_NO\nLine: a\nLine: b`,
  );
  expect(codes(checkCatalogues({ de }))).toContain(
    "second-part-line-count:de:bar_NO",
  );
});

it("detects breaking changes between versions", () => {
  const before = catalog("de", DE);
  const after = catalog(
    "de",
    DE.replace("Line: [Empty]\n", "Line: [Empty]\nLine: neu {bar}\n"),
  );
  expect(codes(compareCatalogues({ de: before }, { de: after }))).toEqual([
    "shifted-lines:de:foo",
  ]);
  const appended = catalog(
    "de",
    DE.replace("Line: wenig {bar}", "Line: wenig {bar}\nLine: neu"),
  );
  expect(compareCatalogues({ de: before }, { de: appended })).toEqual([]);
  const removed = catalog("de", DE.replace("Line: wenig {bar}\n", ""));
  expect(codes(compareCatalogues({ de: before }, { de: removed }))).toEqual([
    "removed-lines:de:foo",
  ]);
});

it("detects lines swapped against the reference language", () => {
  const swapped = catalog(
    "it",
    DE.replace(
      "Line: viel {bar}\nLine: wenig {bar}",
      "Line: wenig {bar}\nLine: viel {bar}",
    ),
  );
  expect(
    codes(checkCatalogues({ de: catalog("de", DE), it: swapped })),
  ).toEqual([
    "misaligned-line:it:foo",
    "misaligned-line:it:foo",
    "untranslated:it:bar",
  ]);
});
