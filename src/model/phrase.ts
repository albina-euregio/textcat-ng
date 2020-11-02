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
