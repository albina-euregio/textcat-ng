type Identifier = string;

interface Header {
  header: { [L in Lang]: string };
}

interface CurlyName {
  curlyName: Identifier;
}

interface Sentence extends Header, CurlyName {
  phrases: (Identifier | Phrase)[];
  pos: number[];
  posGerman: number[];
}

interface Phrase extends Header, CurlyName {
  lines: Option[];
}

interface Option extends Header {
  phrasesInHeader?: Phrase[];
}

interface Textcat {
  sentences: Sentence[];
  phrases: Phrase[];
  sentence(curlyName: string): Sentence;
  searchSentences(search: string): Sentence[];
  phrase(curlyName: string): Phrase;
}

interface WrittenSentenceOrPhrase extends CurlyName {
  line: number;
  args?: WrittenSentenceOrPhrase[];
}
