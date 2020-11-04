import { Identifier, IntlText } from ".";

export interface SentenceOrPhrase {
  $type: "Phrase" | "Sentence";
  curlyName: Identifier;
  header: string;
  lines: {
    line: IntlText;
    linePhrases?: IntlText[];
    region?: string;
  }[];
}

export interface Phrase extends SentenceOrPhrase {
  $type: "Phrase";
}

export function isPhrase(p?: SentenceOrPhrase): p is Phrase {
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

export const SECOND_ITEM_PART_NO_SUFFIX = "_NO";
export const SECOND_ITEM_PART_NO_REGEX = /_NO$/;

export function normalizeCurlyName(curlyName: Identifier): Identifier {
  // remove _NO suffix for secondary/synchronized phrases
  return curlyName.replace(SECOND_ITEM_PART_NO_REGEX, "");
}
