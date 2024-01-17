import { LANGUAGES, Lang } from ".";
import { Joker, isJoker, withJokerText } from "./writtenText";

export const DEEPL_LANGUAGES: Lang[] = ["de", "en", "es", "fr", "it"];

export function isTranslateJokerEnabled(): boolean {
  return !!import.meta.env.DEEPL;
}

export async function translateJoker(writtenPhrase: Joker, sourceLang: Lang) {
  // https://www.deepl.com/docs-api/translate-text
  if (!isJoker(writtenPhrase)) throw new Error();
  if (!DEEPL_LANGUAGES.includes(sourceLang)) {
    throw new Error("Cannot translate from " + sourceLang);
  }
  for (const targetLang of LANGUAGES) {
    if (sourceLang === targetLang) continue;
    if (!DEEPL_LANGUAGES.includes(targetLang)) continue;
    const url = "https://api-free.deepl.com/v2/translate";
    const body = {
      text: [writtenPhrase.args[sourceLang]],
      source_lang: sourceLang.toUpperCase(),
      target_lang: targetLang.toUpperCase()
    };
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: "DeepL-Auth-Key " + import.meta.env.DEEPL,
        "Accept-Encoding": "application/json",
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      console.warn("Failed to translate text", body);
      continue;
    }
    const json: { translations: { text: string }[] } = await response.json();
    const text = json.translations?.[0]?.text;
    if (text) {
      writtenPhrase = withJokerText(writtenPhrase, targetLang, text);
    }
  }
  return writtenPhrase;
}
