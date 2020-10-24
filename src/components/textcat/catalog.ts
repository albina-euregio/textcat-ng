import { createContext } from "preact";

export const emptyCatalog: TextcatCatalog = Object.freeze({
  sentence: () => undefined,
  searchSentences: () => [],
  splitPhraseLine: () => [],
  phrase: () => undefined
});

export const Catalog = createContext<TextcatCatalog>(emptyCatalog);
