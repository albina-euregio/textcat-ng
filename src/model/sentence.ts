import { Identifier, IntlText } from ".";

export interface Sentence {
  $type: "Sentence";
  curlyName: Identifier;
  header: IntlText;
  phrases: Identifier[];
  pos: number[];
  posGerman: number[];
  // phrases+pos+posGerman -> lines
}
