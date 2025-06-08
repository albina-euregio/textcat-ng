import { ref } from "vue";

export const sentenceCurlyName = ref("");
export const phraseCurlyName = ref("");
export const headerOrCurlyName = ref<"header" | "curlyName">("header");

// setCatalogs(await catalogs.changePhrase(lang, phrase))
