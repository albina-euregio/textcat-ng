import { FunctionalComponent } from "preact";
import { useEffect, useState, useMemo } from "preact/hooks";
import {
  AllTextCatalogues,
  buildAllTextcat,
  isSentence,
  Phrase,
  serializePhrase,
  serializeSentence,
  Translations
} from "../model";
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
import { get, set } from "idb-keyval";
import SentenceEditor from "./textcat/sentenceEditor";
import PhraseEditor from "./textcat/phraseEditor";

const App: FunctionalComponent = () => {
  const [srcRegion, setSrcRegion] = useState<string>("");
  const [showTranslation, setShowTranslation] = useState(true);
  const [changeCount, setChangeCount] = useState(1);

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
  useEffect(() => {
    if (!dirHandle) return;
    buildAllTextcat(dirHandle).then(cs => setCatalogs(cs));
  }, [dirHandle]);
  const translations: Translations = useMemo(() => {
    console.log(changeCount);
    return catalogs?.translateAll(writtenText) ?? ({} as Translations);
  }, [catalogs, writtenText, changeCount]);

  const { postPmData } = usePmData(setSrcLang, setSrcRegion, setWrittenText);

  async function ohPhraseChange(lang: Lang, phrase: Phrase) {
    if (!catalogs) return;
    setChangeCount(c => c + 1);
    const phraseHandle = isSentence(phrase)
      ? catalogs.catalogs[lang].sentencesHandle
      : catalogs.catalogs[lang].phrasesHandle;
    if (!phraseHandle) return;
    const handle = await phraseHandle.getFileHandle(`${phrase.curlyName}.txt`);
    const writable = await handle.createWritable();
    await writable.write(
      isSentence(phrase) ? serializeSentence(phrase) : serializePhrase(phrase)
    );
    await writable.close();
  }

  return (
    <section>
      <button
        onClick={async () => {
          const handle = await window.showDirectoryPicker();
          setDirHandle(handle);
          set("dirHandle", handle);
        }}
      >
        Open satzkatalog directory
      </button>
      <h1 class="d-none">textcat-ng</h1>

      {catalog && catalogs && (
        <SentenceEditor
          sentences={catalog.sentences}
          catalogs={catalogs}
          onSentenceChange={ohPhraseChange}
        />
      )}
      {catalog && catalogs && (
        <PhraseEditor
          phrases={catalog.phrases}
          catalogs={catalogs}
          onPhraseChange={ohPhraseChange}
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
