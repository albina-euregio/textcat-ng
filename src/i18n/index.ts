import { srcLang } from "../components/state";

import en from "./en.json";
const i18nMessages = import.meta.glob("./*.json", { eager: true });

type I18nKeys = keyof typeof en;

/**
 * Returns the translation for the given message key.
 * @param key the message key
 * @param args arguments to substitute $1, $2, … in the message for
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function t(key: I18nKeys, ...args: any[]): string {
  const messages = i18nMessages[`./${srcLang.value}.json`]?.default;
  const message = messages?.[key] || en?.[key] || key;
  return message.replace(/\$(\d+)/g, (_, index) => args[index - 1]);
}
