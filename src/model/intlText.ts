export type Identifier = string;

export type Lang = "ca" | "de" | "en" | "fr" | "it";

export const LANGUAGES: readonly Lang[] = Object.freeze([
  "ca",
  "de",
  "en",
  "fr",
  "it"
]);

export type IntlText = Partial<Record<Lang, string>>;

export function mergeIntlText(text1: IntlText, text2: IntlText): IntlText {
  return {
    ca: `${text1.ca} ${text2.ca}`,
    de: `${text1.de} ${text2.de}`,
    en: `${text1.en} ${text2.en}`,
    fr: `${text1.fr} ${text2.fr}`,
    it: `${text1.it} ${text2.it}`
  };
}
