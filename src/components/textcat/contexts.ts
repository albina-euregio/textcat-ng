import { createContext } from "preact";
import { Satzkatalog, TextcatCatalog } from "../../model";

export const CatalogContext = createContext<TextcatCatalog>(
  new Satzkatalog("en")
);
