import { Identifier, IntlText, Phrase } from ".";

export interface Sentence {
  $type: "Sentence";
  curlyName: Identifier;
  header: IntlText;
  phrases: Identifier[];
  pos: number[];
  posGerman: number[];
  // phrases+pos+posGerman -> lines
}

export function isSentence(s?: Sentence | Phrase): s is Sentence {
  return s?.$type === "Sentence";
}
