export type Lang =
  /** Catalan language */
  | "ca"
  /** German */
  | "de"
  /** English */
  | "en"
  /** Spanish */
  | "es"
  /** French */
  | "fr"
  /** Italian */
  | "it"
  /** Occitan language */
  | "oc";

export type LanguageVariant = Lang | "de_AT" | "de_CH";

export const LANGUAGES: readonly Lang[] = Object.freeze(
  import.meta.env.VITE_LANGUAGES.split(",") as Lang[]
);

export const LANGUAGE_VARIANTS = Object.freeze(
  import.meta.env.VITE_LANGUAGE_VARIANTS.split(",") as LanguageVariant[]
);

export const DEFAULT_LANG: Lang = import.meta.env.VITE_DEFAULT_LANG as Lang;

export const DEEPL_LANGUAGES: readonly Lang[] = Object.freeze(
  import.meta.env.VITE_DEEPL_LANGUAGES.split(",") as Lang[]
);
