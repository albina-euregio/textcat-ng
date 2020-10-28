import { createContext } from "preact";
import { Satzkatalog } from "./satzkatalog";

export const Catalog = createContext<TextcatCatalog>(new Satzkatalog());
