import { Identifier, IntlText, Lang, Sentence } from ".";

export interface Phrase {
  $type: "Phrase";
  curlyName: Identifier;
  header: string;
  lines: {
    line: IntlText;
    linePhrases?: IntlText[];
    region?: string;
  }[];
}

export function isPhrase(p?: Sentence | Phrase): p is Phrase {
  return p?.$type === "Phrase";
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
