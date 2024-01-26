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

export const LANGUAGES: readonly Lang[] = Object.freeze([
  "de",
  "en",
  "fr",
  "it",
  "es",
  "ca",
  "oc"
]);

export const LANGUAGE_VARIANTS = Object.freeze([
  "de",
  "de_AT",
  "de_CH",
  "en",
  "fr",
  "it",
  "es",
  "ca",
  "oc"
] as const);

export const DEFAULT_LANG: Lang = "de";
