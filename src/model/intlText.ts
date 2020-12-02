export type Identifier = string;

export type IntlText = string;

export function mergeIntlText(text1: IntlText, text2: IntlText): IntlText {
  return `${text1} ${text2}`;
}
