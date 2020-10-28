import { createContext } from "preact";

export const emptyCatalog: TextcatCatalog = Object.freeze({
  sentence: () => undefined,
  searchSentences: () => [],
  phrase: () => undefined
});

export const Catalog = createContext<TextcatCatalog>(emptyCatalog);
