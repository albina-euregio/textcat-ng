import { Identifier, IntlText } from ".";

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
  linePhrase: IntlText,
  mapCurlyName: (curlyName: string) => T,
  mapText: (text: IntlText) => T
): T {
  return linePhrase.de?.startsWith("{")
    ? mapCurlyName(linePhrase.de.substring(1, linePhrase.de.length - 1))
    : mapText(linePhrase);
}
