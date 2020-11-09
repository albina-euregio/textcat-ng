import { createContext } from "preact";
import { defaultLang, Satzkatalog, TextcatCatalog } from "../../model";

export const CatalogContext = createContext<TextcatCatalog>(
  new Satzkatalog(defaultLang())
);
