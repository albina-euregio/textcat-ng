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

export function serializeSentence(sentence: Sentence): string {
  const lineFragments = [...sentence.lines[0].line.matchAll(/\{([^}]+)\}/g)];
  return [
    `ST_Header: ${sentence.header}`,
    `ST_CurlyName: ${sentence.curlyName}`,
    ...lineFragments.map(
      (l, index) => `PA_Pos: ${index + 1}\nRS_CurlyName: ${l[1]}`
    ),
    "",
    ""
  ].join("\n");
}
