type Identifier = string;

type Lang = "de" | "en" | "it";

type IntlText = Partial<Record<Lang, string>>;

interface Sentence {
  $type: "Sentence";
  curlyName: Identifier;
  header: IntlText;
  phrases: (Identifier | Phrase)[];
  pos: number[];
  posGerman: number[];
  // phrases+pos+posGerman -> lines
}

interface Phrase {
  $type: "Phrase";
  curlyName: Identifier;
  header: IntlText;
  lines: {
    line: IntlText;
    linePhrases?: Phrase[];
    region?: string;
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
