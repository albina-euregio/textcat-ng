type Identifier = string;

type Lang = "de" | "en" | "it";

type IntlText = Record<Lang, string>;

interface Sentence {
  curlyName: Identifier;
  header: IntlText;
  phrases: (Identifier | Phrase)[];
  pos: number[];
  posGerman: number[];
  // phrases+pos+posGerman -> lines
}

interface Phrase {
  curlyName: Identifier;
  header: IntlText;
  lines: {
    line: IntlText;
    linePhrases?: Phrase[];
  }[];
}

interface Textcat {
  sentences: Sentence[];
  phrases: Phrase[];
  sentence(curlyName: Identifier): Sentence;
  searchSentences(search: string): Sentence[];
  phrase(curlyName: Identifier): Phrase;
}

interface WrittenSentenceOrPhrase {
  curlyName: Identifier;
  line: number;
  args?: WrittenSentenceOrPhrase[];
}
