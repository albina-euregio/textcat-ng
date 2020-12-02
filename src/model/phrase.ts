import { IntlText } from ".";

export type CurlyName = string;

export interface Phrase {
  $type: "Phrase" | "Sentence";
  curlyName: CurlyName;
  header: string;
  lines: {
    line: IntlText;
    lineFragments?: IntlText[];
    region?: string;
  }[];
}

export const FULL_STOP = "{Punkt}";
export const SECOND_ITEM_PART_NO_SUFFIX = "_NO";
export type CurlyNameSuffix = "" | typeof SECOND_ITEM_PART_NO_SUFFIX;

export function isPhrase(p?: Phrase): p is Phrase {
  return p?.$type === "Phrase";
}

export function uniqueLineFragments(phrase: Phrase): string[] | undefined {
  if (phrase?.lines.length === 1) {
    return phrase?.lines[0].lineFragments;
  } else {
    return undefined;
  }
}

export function mapLineFragment<T>(
  lineFragment: IntlText,
  mapCurlyName: (curlyName: CurlyName, curlyNameSuffix: CurlyNameSuffix) => T,
  mapText: (text: IntlText) => T
): T {
  return lineFragment?.startsWith("{") && lineFragment?.endsWith("_NO}")
    ? mapCurlyName(lineFragment.substring(1, lineFragment.length - 4), "_NO")
    : lineFragment?.startsWith("{")
    ? mapCurlyName(lineFragment.substring(1, lineFragment.length - 1), "")
    : mapText(lineFragment);
}
