import {
  AllTextCatalogues,
  arrayMove,
  DEFAULT_LANG,
  Lang,
  TextCatalogue,
  Translations,
  WrittenPhrase,
  WrittenText
} from "../model";
import { useDebounce } from "@vueuse/core";
import { computed, Ref, ref } from "vue";

export const textcatEditor = import.meta.env.VITE_TEXTCAT_EDITOR === "1";
export const sentenceList = import.meta.env.VITE_SENTENCE_LIST !== "0";
export const moveButtons = import.meta.env.VITE_MOVE_BUTTONS !== "0";
export const headerOrCurlyName = ref<"header" | "curlyName">("header");
export const srcLang = ref<Lang>(DEFAULT_LANG);
export const srcRegion = ref("");
export const showTranslation = ref(false);
export const readOnly = ref(false);
export const dirHandle: Ref<FileSystemDirectoryHandle | undefined> =
  ref(undefined);
export const writtenText: Ref<WrittenText> = ref([]);
export const catalogs: Ref<AllTextCatalogues | undefined> = ref(undefined);
export const catalog: Ref<TextCatalogue | undefined> = computed(
  () => catalogs.value?.catalogs[srcLang.value]
);
export const translations = computed(
  () => catalogs.value?.translateAll(writtenText.value) ?? ({} as Translations)
);
export function setWrittenPhrase(newText: WrittenPhrase, index: number): void {
  writtenText.value = [...writtenText.value];
  writtenText.value[index] = newText;
}
export const searchText = ref("");

export const searchTextDebounced = useDebounce(searchText);

export const searchWords = computed((): string[] =>
  catalog.value!.splitSearchText(searchTextDebounced.value)
);

export function addSentence(
  newText: WrittenPhrase,
  index: number = writtenText.value.length
): void {
  writtenText.value = [...writtenText.value];
  writtenText.value.splice(index, 0, newText);
}

export function moveSentence(
  fromIndex: number,
  toIndex: number | undefined
): void {
  writtenText.value = arrayMove(writtenText.value, fromIndex, toIndex);
}

export function addWrittenPhrase(phrase: WrittenPhrase): void {
  addSentence(phrase, writtenText.value.length);
}

export const isClipboardEnabled = computed(
  () =>
    typeof navigator.clipboard.writeText === "function" &&
    typeof navigator.clipboard.readText === "function"
);

export async function copyToClipboard(value: WrittenPhrase | WrittenText) {
  await navigator.clipboard.writeText(JSON.stringify(value));
}

export async function pasteSentenceFromClipboard(index: number) {
  const copiedPhrase = await navigator.clipboard.readText();
  try {
    const phrase: WrittenPhrase | WrittenText = JSON.parse(copiedPhrase);
    console.log(phrase);
    if (Array.isArray(phrase)) {
      console.log("Pasting sentences", phrase);
      phrase.forEach(p => addSentence(p));
    } else if (phrase.curlyName) {
      console.log("Pasting sentence", phrase);
      addSentence(phrase, index + 1);
    }
  } catch (error) {
    console.error(error);
  }
}
