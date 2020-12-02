import { IntlText, Phrase, TextCatalogue } from ".";

export interface Sentence extends Phrase {
  $type: "Sentence";
}

export function isSentence(s?: Phrase): s is Sentence {
  return s?.$type === "Sentence";
}

export function sentencePreview(
  s: Sentence,
  catalog: TextCatalogue,
  translation?: IntlText
): string {
  const preview =
    translation ?? catalog.translateLineFragments(s.lines?.[0]?.lineFragments);
  return `${s.header} \u2014 ${preview}`;
}
