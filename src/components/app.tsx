import { FunctionalComponent, h } from "preact";
import { useEffect, useState, useMemo } from "preact/hooks";
import {
  buildTextcat,
  buildAllTextcat,
  TextCatalogue,
  translateAll,
  Translations
} from "../model";
import { CatalogContext } from "./textcat/contexts";
import TextComposer from "./textcat/textComposer";
import {
  arrayMove,
  defaultLang,
  defaultWrittenPhrase,
  Lang,
  WrittenText
} from "../model";
import TranslationPreview from "./textcat/translationPreview";
import { usePmData } from "./textcat/pmData";
import TextcatFooter from "./textcat/textcatFooter";
import LanguageSelect from "./textcat/languageSelect";
import RegionSelect from "./textcat/regionSelect";
import { t, setI18nLang } from "../i18n";
import checkSquare from "bootstrap-icons/icons/check-square.svg";

const App: FunctionalComponent = () => {
  const [srcRegion, setSrcRegion] = useState<string>("");

  const [srcLang, setSrcLang] = useState<Lang>(defaultLang());
  const [catalog, setCatalog] = useState<TextCatalogue>(
    new TextCatalogue(srcLang)
  );
  useEffect(() => {
    buildTextcat(srcLang).then(c => setCatalog(c));
    setI18nLang(srcLang);
  }, [srcLang]);

  const [writtenText, setWrittenText] = useState<WrittenText>([
    defaultWrittenPhrase()
  ]);

  const [catalogs, setCatalogs] = useState<TextCatalogue[]>([]);
  useEffect(() => {
    buildAllTextcat().then(cs => setCatalogs(cs));
  }, []);
  const translations: Translations = useMemo(
    () => translateAll(catalogs, writtenText),
    [catalogs, writtenText]
  );

  const { postPmData } = usePmData(setSrcLang, setSrcRegion, setWrittenText);

  return (
    <section>
      <h1 class="d-none">textcat-ng</h1>

      <h2>
        {`${t("input")} `}
        <small>
          <LanguageSelect srcLang={srcLang} setSrcLang={setSrcLang} />
          <RegionSelect
            regions={catalog.regions}
            srcRegion={srcRegion}
            setSrcRegion={setSrcRegion}
          />
        </small>
      </h2>

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
          moveSentence={(index, direction): void => {
            setWrittenText(ts =>
              arrayMove(
                ts,
                index,
                direction === 0 ? undefined : index + direction
              )
            );
          }}
        />
      </CatalogContext.Provider>

      <h2>{t("translations")}</h2>
      <TranslationPreview translations={translations} />
      <button
        class="mt-10"
        type="submit"
        onClick={(): void => postPmData(writtenText, translations)}
      >
        <img src={checkSquare}></img> {t("translations.submit")}
      </button>

      <TextcatFooter />
    </section>
  );
};

export default App;
