export type Identifier = string;

export type Lang = "ar" | "ca" | "de" | "en" | "es" | "fr" | "it";

export const LANGUAGES: readonly Lang[] = Object.freeze([
  "ar",
  "ca",
  "de",
  "en",
  "es",
  "fr",
  "it"
]);

export const DEFAULT_LANG: Lang = "de";

export type IntlText = string;

export function mergeIntlText(text1: IntlText, text2: IntlText): IntlText {
  return `${text1} ${text2}`;
}
