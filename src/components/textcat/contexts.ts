import { createContext } from "preact";
import { DEFAULT_LANG, TextCatalogue } from "../../model";
import type { T } from "../../i18n";

export const CatalogContext = createContext<TextCatalogue>(
  new TextCatalogue(DEFAULT_LANG)
);

export const I18nContext = createContext<T>(() => "");
