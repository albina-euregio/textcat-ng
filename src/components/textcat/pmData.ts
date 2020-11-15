import { StateUpdater, useEffect, useState } from "preact/hooks";
import { Lang, Translations, WrittenText } from "../../model";

// alias pmData, alias inputDef
interface TextcatLegacyIn {
  textDef: string;
  textField: string;
  srcLang: number | Lang;
  currentLang: Lang;
}

// alias pmData, alias outputText
interface TextcatLegacyOut {
  textDef: string;
  textField: string;
  textDe: string;
  textIt: string;
  textEn: string;
  textFr: string;
  textCa: string;
}

// interoperability with albina-admin-gui: send/receive pmData messages
export function usePmData(
  setSrcLang: StateUpdater<Lang>,
  setWrittenTexts: StateUpdater<WrittenText[]>
): {
  postPmData: (writtenTexts: WrittenText[], translations: Translations) => void;
} {
  const [textField, setTextField] = useState("");

  function receivePmData(event: MessageEvent) {
    if (typeof event.data !== "string") return;
    const pmData = JSON.parse(event.data) as TextcatLegacyIn;
    if (typeof pmData.textDef !== "string") return;
    console.log("Received message", pmData);
    setTextField(pmData.textField);
    setSrcLang(pmData.currentLang);
    const text = pmData.textDef
      ? (JSON.parse(pmData.textDef) as WrittenText[])
      : [];
    setWrittenTexts(text);
  }

  useEffect(() => {
    window.addEventListener("message", receivePmData);
    return () => window.removeEventListener("message", receivePmData);
  }, []);

  function postPmData(writtenTexts: WrittenText[], translations: Translations) {
    const pmData: TextcatLegacyOut = {
      textDef: JSON.stringify(writtenTexts),
      textField,
      textCa: translations.ca,
      textDe: translations.de,
      textEn: translations.en,
      textFr: translations.fr,
      textIt: translations.it
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