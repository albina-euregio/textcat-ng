import { FunctionalComponent } from "preact";
import { useEffect, useState, useMemo, useCallback } from "preact/hooks";
import { AllTextCatalogues, buildAllTextcat, Translations } from "../model";
import { CatalogContext } from "./textcat/contexts";
import TextComposer from "./textcat/textComposer";
import { arrayMove, DEFAULT_LANG, Lang, WrittenText } from "../model";
import TranslationPreview from "./textcat/translationPreview";
import { usePmData } from "./textcat/pmData";
import TextcatFooter from "./textcat/textcatFooter";
import LanguageSelect from "./textcat/languageSelect";
import RegionSelect from "./textcat/regionSelect";
import TranslationCheckbox from "./textcat/translationCheckbox";
import { t, setI18nLang } from "../i18n";
import CheckSquare from "./bootstrap-icons/check-square";
import FolderOpen from "./bootstrap-icons/folder2-open";
import ArrowClockwise from "./bootstrap-icons/arrow-clockwise";
import { get, set } from "idb-keyval";
import TextcatEditor from "./textcat/textcatEditor";

const App: FunctionalComponent = () => {
  const [srcRegion, setSrcRegion] = useState<string>("");
  const [showTranslation, setShowTranslation] = useState(true);

  const [dirHandle, setDirHandle] = useState<
    FileSystemDirectoryHandle | undefined
  >(undefined);
  useEffect(() => {
    get<FileSystemDirectoryHandle | undefined>("dirHandle").then(setDirHandle);
  }, []);

  const [srcLang, setSrcLang] = useState<Lang>(DEFAULT_LANG);
  useEffect(() => {
    setI18nLang(srcLang);
  }, [srcLang]);

  const [writtenText, setWrittenText] = useState<WrittenText>([]);

  const [catalogs, setCatalogs] = useState<AllTextCatalogues | undefined>(
    undefined
  );
  const catalog = useMemo(
    () => catalogs?.catalogs[srcLang],
    [catalogs, srcLang]
  );
  const reloadTextcat = useCallback(() => {
    if (!dirHandle) return;
    buildAllTextcat(dirHandle).then(cs => setCatalogs(cs));
  }, [dirHandle]);
  useEffect(() => reloadTextcat(), [reloadTextcat]);
  const translations: Translations = useMemo(
    () => catalogs?.translateAll(writtenText) ?? ({} as Translations),
    [catalogs, writtenText]
  );

  const { postPmData } = usePmData(setSrcLang, setSrcRegion, setWrittenText);

  return (
    <section>
      <button
        onClick={async () => {
          const handle = await window.showDirectoryPicker();
          setDirHandle(handle);
          set("dirHandle", handle);
        }}
      >
        <FolderOpen /> Open satzkatalog directory
      </button>
      <button onClick={() => reloadTextcat()}>
        <ArrowClockwise /> Reload satzkatalog
      </button>
      <h1 class="d-none">textcat-ng</h1>

      {catalog && catalogs && (
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

      <h2>{t("heading.translations")}</h2>
      {showTranslation && <TranslationPreview translations={translations} />}
      <button
        class="mt-10"
        type="submit"
        onClick={(): void => postPmData(writtenText, translations)}
      >
        <CheckSquare /> {t("translations.submit")}
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
  );
};

export default App;
