import { SentenceOrPhrase } from ".";

export interface Sentence extends SentenceOrPhrase {
  $type: "Sentence";
}

export function isSentence(s?: SentenceOrPhrase): s is Sentence {
  return s?.$type === "Sentence";
}
