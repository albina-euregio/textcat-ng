import { Lang, defaultLang } from "../model";

import de from "./de.json";
import en from "./en.json";
const i18nMessages: Partial<Record<Lang, Record<string, string>>> = {
  de,
  en
};

let lang: Lang = defaultLang();

export function setI18nLang(l: Lang): void {
  lang = l;
}

/**
 * Returns the translation for the given message key.
 * @param key the message key
 * @param argument an argument to substitute $1 in the message for
 */
export function t(key: string, argument?: string): string {
  const messages = i18nMessages[lang] || i18nMessages.en;
  const message = messages?.[key] || i18nMessages.en?.[key] || key;
  return argument !== undefined ? message.replace(/\$1/g, argument) : message;
}
