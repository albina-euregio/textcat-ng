import { Identifier, IntlText } from ".";

export interface Phrase {
  $type: "Phrase" | "Sentence";
  curlyName: Identifier;
  header: string;
  lines: {
    line: IntlText;
    linePhrases?: IntlText[];
    region?: string;
  }[];
}

export function isPhrase(p?: Phrase): p is Phrase {
  return p?.$type === "Phrase";
}

export function mapLinePhrase<T>(
  linePhrase: IntlText,
  mapCurlyName: (curlyName: string, curlyNameSuffix?: "_NO") => T,
  mapText: (text: IntlText) => T
): T {
  return linePhrase?.startsWith("{") && linePhrase?.endsWith("_NO}")
    ? mapCurlyName(linePhrase.substring(1, linePhrase.length - 4), "_NO")
    : linePhrase?.startsWith("{")
    ? mapCurlyName(linePhrase.substring(1, linePhrase.length - 1))
    : mapText(linePhrase);
}

export const SECOND_ITEM_PART_NO_SUFFIX = "_NO";
