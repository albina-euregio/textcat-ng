import { Identifier, IntlText } from ".";

export interface Phrase {
  $type: "Phrase" | "Sentence";
  curlyName: Identifier;
  header: string;
  lines: {
    line: IntlText;
    lineFragments?: IntlText[];
    region?: string;
  }[];
}

export function isPhrase(p?: Phrase): p is Phrase {
  return p?.$type === "Phrase";
}

export function mapLineFragment<T>(
  lineFragment: IntlText,
  mapCurlyName: (curlyName: string, curlyNameSuffix?: "_NO") => T,
  mapText: (text: IntlText) => T
): T {
  return lineFragment?.startsWith("{") && lineFragment?.endsWith("_NO}")
    ? mapCurlyName(lineFragment.substring(1, lineFragment.length - 4), "_NO")
    : lineFragment?.startsWith("{")
    ? mapCurlyName(lineFragment.substring(1, lineFragment.length - 1))
    : mapText(lineFragment);
}

export const SECOND_ITEM_PART_NO_SUFFIX = "_NO";
