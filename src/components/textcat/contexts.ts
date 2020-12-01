import { createContext } from "preact";
import { DEFAULT_LANG, TextCatalogue } from "../../model";

export const CatalogContext = createContext<TextCatalogue>(
  new TextCatalogue(DEFAULT_LANG)
);
