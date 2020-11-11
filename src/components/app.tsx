import { FunctionalComponent, h } from "preact";
import { buildTextcat, TextCatalogue } from "../model";
import { useEffect, useState } from "preact/hooks";
import { CatalogContext } from "./textcat/contexts";
import BulletinComposer from "./textcat/bulletinComposer";
import {
  arrayMove,
  defaultLang,
  defaultWrittenText,
  Lang,
  LANGUAGES,
  newSentence,
  WrittenText
} from "../model";
import TranslationPreview from "./textcat/translationPreview";

const App: FunctionalComponent = () => {
  const [srcLang, setSrcLang] = useState<Lang>(defaultLang());
  const [srcRegion, setSrcRegion] = useState<string>("");
  const [catalog, setCatalog] = useState<TextCatalogue>(
    new TextCatalogue(srcLang)
  );
  const [catalogs, setCatalogs] = useState<TextCatalogue[]>([]);
  const [writtenTexts, setWrittenTexts] = useState<WrittenText[]>([
    defaultWrittenText()
  ]);

  useEffect(() => {
    buildTextcat(srcLang).then(c => setCatalog(c));
  }, [srcLang]);
  const addCatalog = (c: TextCatalogue): void => setCatalogs(cs => [c, ...cs]);
  useEffect(() => {
    Promise.all(
      LANGUAGES.map(lang => buildTextcat(lang).then(c => addCatalog(c)))
    );
  }, []);

  return (
    <section>
      <h1>
        <abbr title="text catalog: new generation">textcat-ng</abbr>{" "}
        <small>({process.env.GIT_VERSION})</small>
      </h1>

      <h2>
        Input{" "}
        <small>
          <label>
            {"[Language: "}
            <select
              value={srcLang}
              onChange={(e): void =>
                setSrcLang((e.target as HTMLSelectElement).value as Lang)
              }
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            {"]"}
          </label>{" "}
          <label>
            {"[Region: "}
            <select
              value={srcRegion}
              onChange={(e): void =>
                setSrcRegion((e.target as HTMLSelectElement).value)
              }
            >
              <option value=""></option>
              {Array.from(catalog.regions)
                .sort()
                .map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
            </select>
            {"]"}
          </label>
        </small>
      </h2>

      <CatalogContext.Provider value={catalog}>
        <BulletinComposer
          writtenTexts={writtenTexts}
          srcRegion={srcRegion}
          updateWrittenText={(newText, index): void =>
            setWrittenTexts(ts => {
              const newTexts = [...ts];
              newTexts[index] = newText;
              return newTexts;
            })
          }
          addSentence={(curlyName): void =>
            setWrittenTexts(ts => [...ts, newSentence(curlyName)])
          }
          moveSentence={(index, direction): void => {
            setWrittenTexts(ts =>
              arrayMove(
                ts,
                index,
                direction === 0 ? undefined : index + direction
              )
            );
          }}
        />
      </CatalogContext.Provider>

      <h2>Output</h2>
      <TranslationPreview catalogs={catalogs} writtenTexts={writtenTexts} />
    </section>
  );
};

export default App;
