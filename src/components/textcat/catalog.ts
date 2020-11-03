import { createContext } from "preact";
import { Satzkatalog, TextcatCatalog } from "../../model";

export const Catalog = createContext<TextcatCatalog>(new Satzkatalog("en"));
