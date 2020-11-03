import { Identifier, IntlText, Lang } from ".";

export interface Phrase {
  $type: "Phrase";
  curlyName: Identifier;
  header: IntlText;
  lines: {
    line: IntlText;
    linePhrases?: IntlText[];
    region?: string;
  }[];
}

export function mapLinePhrase<T>(
  lang: Lang,
  linePhrase: IntlText,
  mapCurlyName: (curlyName: string) => T,
  mapText: (text: IntlText) => T
): T {
  const linePhraseLang = linePhrase[lang];
  return linePhraseLang?.startsWith("{")
    ? mapCurlyName(linePhraseLang.substring(1, linePhraseLang.length - 1))
    : mapText(linePhrase);
}
