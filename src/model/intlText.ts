export type Identifier = string;

export type Lang = "de" | "en" | "fr" | "it";

export type IntlText = Partial<Record<Lang, string>>;

export function mergeIntlText(text1: IntlText, text2: IntlText): IntlText {
  return {
    de: `${text1.de} ${text2.de}`,
    en: `${text1.en} ${text2.en}`,
    fr: `${text1.fr} ${text2.fr}`,
    it: `${text1.it} ${text2.it}`
  };
}
