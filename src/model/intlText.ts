export type Identifier = string;

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
  "ca",
  "de",
  "en",
  "es",
  "fr",
  "it",
  "oc"
]);

export const DEFAULT_LANG: Lang = "de";

export type IntlText = string;

export function mergeIntlText(text1: IntlText, text2: IntlText): IntlText {
  return `${text1} ${text2}`;
}
