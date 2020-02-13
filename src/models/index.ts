enum Lang {
  de = "de",
  en = "en",
  // fr = "fr",
  it = "it"
}

type Identifier = string;

interface Header {
  header: { [L in Lang]: string };
}

interface CurlyName {
  curlyName: Identifier;
}

interface Sentence extends Header, CurlyName {
  selectedPhrase?: Phrase;
  phrases: (Identifier | Phrase)[];
  pos: number[];
  posGerman: number[];
}

interface Phrase extends Header, CurlyName {
  selectedLine?: Option;
  lines: Option[];
}

interface Option extends Header {
  selectedPhrase?: Phrase;
  phrasesInHeader?: Phrase[];
}

interface Textcat {
  sentences: Sentence[];
  phrases: Phrase[];
  sentence(curlyName: string): Sentence;
  searchSentences(search: string): Sentence[];
  phrase(curlyName: string): Phrase;
}
