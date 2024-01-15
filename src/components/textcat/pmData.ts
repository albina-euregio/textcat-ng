import { StateUpdater, useEffect, useState } from "preact/hooks";
import { Lang, Translations, WrittenText } from "../../model";

// alias pmData, alias inputDef
interface TextcatLegacyIn {
  textDef: string;
  textField: string;
  currentLang: Lang;
  region: string;
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

/**
 * Messages received before `usePmData.useEffect` has been called.
 */
const PM_DATA_QUEUE: TextcatLegacyIn[] = [];
function receiveInitialPmData(event: MessageEvent): void {
  const pmData = parsePmData(event);
  if (!pmData) return;
  PM_DATA_QUEUE.push(pmData);
}
window.addEventListener("message", receiveInitialPmData);

// interoperability with albina-admin-gui: send/receive pmData messages
export function usePmData(
  setSrcLang: StateUpdater<Lang>,
  setSrcRegion: StateUpdater<string>,
  setWrittenText: StateUpdater<WrittenText>
): {
  postPmData: (writtenText: WrittenText, translations: Translations) => void;
} {
  const [textField, setTextField] = useState("");

  useEffect(() => {
    function processPmData(pmData: TextcatLegacyIn | undefined): void {
      if (!pmData) return;
      console.log("Processing pmData", pmData);
      setTextField(pmData.textField);
      setSrcLang(pmData.currentLang);
      setSrcRegion(pmData.region ?? "");
      const text = pmData.textDef
        ? (JSON.parse(pmData.textDef) as WrittenText)
        : [];
      setWrittenText(text);
    }
    function receivePmData(event: MessageEvent): void {
      processPmData(parsePmData(event));
    }
    window.removeEventListener("message", receiveInitialPmData);
    PM_DATA_QUEUE.forEach(pmData => processPmData(pmData));
    window.addEventListener("message", receivePmData);
    return (): void => window.removeEventListener("message", receivePmData);
  }, [setSrcLang, setSrcRegion, setWrittenText, setTextField]);

  function postPmData(
    writtenText: WrittenText,
    translations: Translations
  ): void {
    const pmData: TextcatLegacyOut = {
      textDef: JSON.stringify(writtenText),
      textField,
      textCa: translations.ca,
      textDe: translations.de,
      textDe_AT: translations.de_AT,
      textDe_CH: translations.de_CH,
      textEn: translations.en,
      textEs: translations.es,
      textFr: translations.fr,
      textIt: translations.it,
      textOc: translations.oc
    };
    console.log("Sending message", pmData);
    if (window.parent.opener) {
      window.parent.opener.postMessage(JSON.stringify(pmData), "*");
    } else if (window.parent) {
      window.parent.postMessage(JSON.stringify(pmData), "*");
    }
  }
  return { postPmData };
}
