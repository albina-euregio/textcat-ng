import { Phrase } from ".";

export interface Sentence extends Phrase {
  $type: "Sentence";
}

export function isSentence(s?: Phrase): s is Sentence {
  return s?.$type === "Sentence";
}
