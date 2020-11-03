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
  linePhrase: IntlText,
  mapCurlyName: (curlyName: string) => T,
  mapText: (text: IntlText) => T
): T {
  return linePhrase?.startsWith("{")
    ? mapCurlyName(linePhrase.substring(1, linePhrase.length - 1))
    : mapText(linePhrase);
}
