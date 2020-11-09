import { FunctionalComponent, h } from "preact";
import {
  buildTextcat,
  Satzkatalog,
  TextcatCatalog
} from "../model/satzkatalog";
import { useEffect, useState } from "preact/hooks";
import { CatalogContext } from "./textcat/contexts";
import BulletinComposer from "./textcat/bulletinComposer";
import {
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
  const [catalog, setCatalog] = useState<TextcatCatalog>(
    new Satzkatalog(srcLang)
  );
  const [catalogs, setCatalogs] = useState<TextcatCatalog[]>([]);
  const [writtenTexts, setWrittenTexts] = useState<WrittenText[]>([
    defaultWrittenText()
  ]);

  useEffect(() => {
    buildTextcat(srcLang).then(c => setCatalog(c));
  }, [srcLang]);
  const addCatalog = (c: TextcatCatalog): void => setCatalogs(cs => [c, ...cs]);
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
        <label>
          Input{" "}
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
        </label>
      </h2>

      <CatalogContext.Provider value={catalog}>
        <BulletinComposer
          writtenTexts={writtenTexts}
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
        />
      </CatalogContext.Provider>

      <h2>Output</h2>
      <TranslationPreview catalogs={catalogs} writtenTexts={writtenTexts} />
    </section>
  );
};

export default App;
