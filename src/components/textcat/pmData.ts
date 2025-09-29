import { Lang, Translations, WrittenText } from "../../model";
import { readOnly, srcLang, srcRegion, writtenText } from "../state";
import { useEventListener } from "@vueuse/core";
import { ref } from "vue";

// alias pmData, alias inputDef
interface TextcatLegacyIn {
  textDef: string;
  textField: string;
  currentLang: Lang;
  region: string;
  readOnly: boolean;
}

// alias pmData, alias outputText
interface TextcatLegacyOut {
  textDef: string;
  textField: string;
  textDe: string;
  textDe_AT: string;
  textDe_CH: string;
  textIt: string;
  textEn: string;
  textEs: string;
  textFr: string;
  textCa: string;
  textOc: string;
}

function parsePmData(event: MessageEvent): TextcatLegacyIn | undefined {
  if (typeof event.data !== "string") return;
  if (!event.data.startsWith("{")) return;
  const pmData = JSON.parse(event.data) as TextcatLegacyIn;
  if (typeof pmData.textDef !== "string") return;
  console.log("Received pmData", pmData);
  return pmData;
}

const textField = ref("");

// interoperability with albina-admin-gui: send/receive pmData messages
function processPmData(pmData: TextcatLegacyIn | undefined): void {
  if (!pmData) return;
  console.log("Processing pmData", pmData);
  textField.value = pmData.textField;
  srcLang.value = pmData.currentLang;
  srcRegion.value = pmData.region ?? "";
  readOnly.value = pmData.readOnly || false;
  writtenText.value = pmData.textDef
    ? (JSON.parse(pmData.textDef) as WrittenText)
    : [];
}

export function usePmData() {
  useEventListener(window, "message", (event) => {
    processPmData(parsePmData(event));
  });
  return { postPmData };
}

function postPmData(
  writtenText: WrittenText,
  translations: Translations,
): void {
  const pmData: TextcatLegacyOut = {
    textDef: JSON.stringify(writtenText),
    textField: textField.value,
    textCa: translations.ca,
    textDe: translations.de,
    textDe_AT: translations.de_AT,
    textDe_CH: translations.de_CH,
    textEn: translations.en,
    textEs: translations.es,
    textFr: translations.fr,
    textIt: translations.it,
    textOc: translations.oc,
  };
  console.log("Sending message", pmData);
  if (window.parent.opener) {
    window.parent.opener.postMessage(JSON.stringify(pmData), "*");
  } else if (window.parent) {
    window.parent.postMessage(JSON.stringify(pmData), "*");
  }
}
