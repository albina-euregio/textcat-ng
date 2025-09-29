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

export function newPhraseLine(
  line: string,
  region: string | undefined = undefined,
): Phrase["lines"][number] {
  return {
    line,
    lineFragments: (line.match(/{[^}]+}|[^{}]+/g) ?? [])
      .map((s) => s.trim())
      .filter((s) => s.length),
    region,
  };
}

export function mapLineFragment<T>(
  lineFragment: IntlText,
  mapCurlyName: (curlyName: CurlyName, curlyNameSuffix: CurlyNameSuffix) => T,
  mapText: (text: IntlText) => T,
): T {
  return lineFragment?.startsWith("{") && lineFragment?.endsWith("_NO}")
    ? mapCurlyName(lineFragment.substring(1, lineFragment.length - 4), "_NO")
    : lineFragment?.startsWith("{")
      ? mapCurlyName(lineFragment.substring(1, lineFragment.length - 1), "")
      : mapText(lineFragment);
}

export function serializePhrase(phrase: Phrase): string {
  return [
    `RS_Header: ${phrase.header}`,
    `RS_CurlyName: ${phrase.curlyName}`,
    ...phrase.lines
      .flatMap(({ line, region }, i, ll) => {
        const prevRegion = i - 1 >= 0 ? ll[i - 1].region : undefined;
        const nextRegion = i + 1 < ll.length ? ll[i + 1].region : undefined;
        return [
          region && region !== prevRegion ? `Begin: ${region}` : undefined,
          `Line: ${line}`,
          region && region !== nextRegion ? `End: ${region}` : undefined,
        ];
      })
      .filter((l) => typeof l === "string"),
    "",
    "",
  ].join("\n");
}

export const REMOVE_ME_HEADER = "IefeiRei8oshohp2wi8yaevievieVahJ";
