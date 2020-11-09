import { createContext } from "preact";
import { defaultLang, TextCatalogue } from "../../model";

export const CatalogContext = createContext<TextCatalogue>(
  new TextCatalogue(defaultLang())
);
