import { srcLang } from "../components/state";
import { Lang } from "../model/language";
import en from "./en.json";

type I18nKeys = keyof typeof en;

const i18nMessages = import.meta.glob("./*.json", {
  eager: true,
  import: "default",
}) satisfies Record<`./${Lang}.json`, Record<I18nKeys, string>>;

/**
 * Returns the translation for the given message key.
 * @param key the message key
 * @param args arguments to substitute $1, $2, … in the message for
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function t(key: I18nKeys, ...args: any[]): string {
  return translate(i18nMessages[`./${srcLang.value}.json`], key, ...args);
}

/**
 * Returns the translation from the given messages, falling back to English for missing or empty messages.
 */
export function translate(
  messages: Partial<Record<I18nKeys, string>> | undefined,
  key: I18nKeys,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
): string {
  const message = messages?.[key] || en?.[key] || key;
  return message.replace(/\$(\d+)/g, (_, index) => args[index - 1]);
}
