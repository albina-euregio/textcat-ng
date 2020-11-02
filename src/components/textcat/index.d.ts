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
    linePhrases?: IntlText[];
    region?: string;
  }[];
}

interface TextcatCatalog {
  sentence(curlyName: Identifier): Sentence | undefined;
  searchSentences(search: string): Sentence[];
  phrase(curlyName: Identifier): Phrase | undefined;
}

interface WrittenText {
  curlyName: Identifier;
  line: number;
  args?: Record<Identifier, WrittenText>;
}

interface WrittenTextProps {
  writtenText: WrittenText;
  setWrittenText: (writtenText: WrittenText) => void;
}
