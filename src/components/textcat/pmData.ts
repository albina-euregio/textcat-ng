import { StateUpdater, useEffect, useState } from "preact/hooks";
import { Lang, Translations, WrittenText } from "../../model";

// alias pmData, alias inputDef
interface TextcatLegacyIn {
  textDef: string;
  textField: string;
  srcLang: number | Lang;
  currentLang: Lang;
  region: string;
}

// alias pmData, alias outputText
interface TextcatLegacyOut {
  textDef: string;
  textField: string;
  textAr: string;
  textDe: string;
  textIt: string;
  textEn: string;
  textEs: string;
  textFr: string;
  textCa: string;
}

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
    function receivePmData(event: MessageEvent): void {
      if (typeof event.data !== "string") return;
      const pmData = JSON.parse(event.data) as TextcatLegacyIn;
      if (typeof pmData.textDef !== "string") return;
      console.log("Received message", pmData);
      setTextField(pmData.textField);
      setSrcLang(pmData.currentLang);
      setSrcRegion(pmData.region ?? "");
      const text = pmData.textDef
        ? (JSON.parse(pmData.textDef) as WrittenText)
        : [];
      setWrittenText(text);
    }
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
      textAr: translations.ar,
      textCa: translations.ca,
      textDe: translations.de,
      textEn: translations.en,
      textEs: translations.es,
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
