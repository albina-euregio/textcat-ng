import { FunctionalComponent } from "preact";
import { useEffect, useState, useMemo, useCallback } from "preact/hooks";
import { AllTextCatalogues, buildAllTextcat, Translations } from "../model";
import { CatalogContext, I18nContext } from "./textcat/contexts";
import TextComposer from "./textcat/textComposer";
import { arrayMove, DEFAULT_LANG, Lang, WrittenText } from "../model";
import TranslationPreview from "./textcat/translationPreview";
import { usePmData } from "./textcat/pmData";
import TextcatFooter from "./textcat/textcatFooter";
import LanguageSelect from "./textcat/languageSelect";
import RegionSelect from "./textcat/regionSelect";
import TranslationCheckbox from "./textcat/translationCheckbox";
import * as i18n from "../i18n";
import CheckSquare from "./bootstrap-icons/check-square";
import FolderOpen from "./bootstrap-icons/folder2-open";
import ArrowClockwise from "./bootstrap-icons/arrow-clockwise";
import { get, set } from "idb-keyval";
import TextcatEditor from "./textcat/textcatEditor";
import Copy from "./bootstrap-icons/copy.tsx";

const App: FunctionalComponent = () => {
  const textcatEditor = import.meta.env.VITE_TEXTCAT_EDITOR === "1";
  const [srcRegion, setSrcRegion] = useState<string>("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const [dirHandle, setDirHandle] = useState<
    FileSystemDirectoryHandle | undefined
  >(undefined);

  useEffect(() => {
    get<FileSystemDirectoryHandle | undefined>("dirHandle").then(setDirHandle);
  }, []);

  const reloadTextcat = useCallback(() => {
    if (!textcatEditor) {
      buildAllTextcat(undefined).then(cs => setCatalogs(cs));
    } else if (dirHandle) {
      buildAllTextcat(dirHandle).then(cs => setCatalogs(cs));
    }
  }, [dirHandle, textcatEditor]);

  const [srcLang, setSrcLang] = useState<Lang>(DEFAULT_LANG);
  const t = useMemo(() => i18n.t.bind(undefined, srcLang), [srcLang]);

  const [writtenText, setWrittenText] = useState<WrittenText>([]);

  const [catalogs, setCatalogs] = useState<AllTextCatalogues | undefined>(
    undefined
  );

  const catalog = useMemo(
    () => catalogs?.catalogs[srcLang],
    [catalogs, srcLang]
  );

  useEffect(() => reloadTextcat(), [reloadTextcat]);

  const translations: Translations = useMemo(
    () => catalogs?.translateAll(writtenText) ?? ({} as Translations),
    [catalogs, writtenText]
  );

  const { postPmData } = usePmData(
    setReadOnly,
    setSrcLang,
    setSrcRegion,
    setWrittenText
  );

  return (
    <I18nContext.Provider value={t}>
      <section>
        {textcatEditor && (
          <button
            onClick={async () => {
              const handle = await window.showDirectoryPicker();
              setDirHandle(handle);
              set("dirHandle", handle);
            }}
          >
            <FolderOpen /> {t("editor.open")}
          </button>
        )}

        {textcatEditor && (
          <button onClick={() => reloadTextcat()}>
            <ArrowClockwise /> {t("editor.reload")}
          </button>
        )}

        <h1 class="d-none">textcat-ng</h1>

        {catalog && catalogs && textcatEditor && (
          <TextcatEditor
            catalog={catalog}
            catalogs={catalogs}
            setCatalogs={setCatalogs}
          />
        )}

        {catalog && (
          <CatalogContext.Provider value={catalog}>
            <TextComposer
              writtenText={writtenText}
              srcRegion={srcRegion}
              readOnly={readOnly}
              setWrittenPhrase={(newText, index): void =>
                setWrittenText(ts => {
                  const newTexts = [...ts];
                  newTexts[index] = newText;
                  return newTexts;
                })
              }
              addSentence={(newText, index): void =>
                setWrittenText(ts => {
                  const newTexts = [...ts];
                  newTexts.splice(index, 0, newText);
                  return newTexts;
                })
              }
              moveSentence={(fromIndex, toIndex): void => {
                setWrittenText(ts => arrayMove(ts, fromIndex, toIndex));
              }}
            />
          </CatalogContext.Provider>
        )}

        {showTranslation && (
          <>
            <h2>{t("heading.translations")}</h2>
            <TranslationPreview translations={translations} />
          </>
        )}

        <button
          class="mt-10"
          type="submit"
          onClick={(): void => postPmData(writtenText, translations)}
        >
          <CheckSquare /> {t("translations.submit")}
        </button>
        <button
          disabled={
            typeof navigator.clipboard.writeText !== "function" ||
            typeof navigator.clipboard.readText !== "function"
          }
          onClick={(): void => {
            navigator.clipboard.writeText(JSON.stringify(writtenText));
          }}
          title={t("translations.copy")}
        >
          <Copy />
        </button>

        <TextcatFooter>
          {catalog?.lastModified && <li>satzkatalog {catalog.lastModified}</li>}
          <li>
            <LanguageSelect srcLang={srcLang} setSrcLang={setSrcLang} />
          </li>
          {catalog && (
            <li>
              <RegionSelect
                regions={catalog.regions}
                srcRegion={srcRegion}
                setSrcRegion={setSrcRegion}
              />
            </li>
          )}
          <li>
            <TranslationCheckbox
              showTranslation={showTranslation}
              setShowTranslation={setShowTranslation}
            />
          </li>
        </TextcatFooter>
      </section>
    </I18nContext.Provider>
  );
};

export default App;
