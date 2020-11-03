export type Identifier = string;

export type Lang = "ca" | "de" | "en" | "fr" | "it";

export const LANGUAGES: readonly Lang[] = Object.freeze([
  "ca",
  "de",
  "en",
  "fr",
  "it"
]);

export type IntlText = string;

export function mergeIntlText(text1: IntlText, text2: IntlText): IntlText {
  return `${text1} ${text2}`;
}
