type Identifier = string;

type Lang = "de" | "en" | "it";

type IntlText = Partial<Record<Lang, string>>;

interface Sentence {
  $type: "Sentence";
  curlyName: Identifier;
  header: IntlText;
  phrases: Identifier[];
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
    linePhrases?: Identifier[];
    region?: string;
  }[];
}

interface TextcatCatalog {
  sentence(curlyName: Identifier): Sentence | undefined;
  searchSentences(search: string): Sentence[];
  phrase(curlyName: Identifier): Phrase | undefined;
}

interface WrittenSentenceOrPhrase {
  curlyName: Identifier;
  line: number;
  args?: WrittenSentenceOrPhrase[];
}
