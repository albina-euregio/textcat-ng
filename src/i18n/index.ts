import { srcLang } from "../components/state";
import { Lang } from "../model";

import en from "./en.json";
type I18nKeys = keyof typeof en;

const i18nMessages = import.meta.glob("./*.json", {
  eager: true,
  import: "default"
}) as Record<`./${Lang}.json`, I18nKeys>;

/**
 * Returns the translation for the given message key.
 * @param key the message key
 * @param args arguments to substitute $1, $2, … in the message for
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function t(key: I18nKeys, ...args: any[]): string {
  const messages = i18nMessages[`./${srcLang.value}.json`];
  const message = messages?.[key] || en?.[key] || key;
  return message.replace(/\$(\d+)/g, (_, index) => args[index - 1]);
}
