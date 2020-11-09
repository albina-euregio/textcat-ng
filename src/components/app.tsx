import { FunctionalComponent, h } from "preact";
import {
  buildTextcat,
  Satzkatalog,
  TextcatCatalog
} from "../model/satzkatalog";
import { useEffect, useMemo, useState } from "preact/hooks";
import { CatalogContext } from "./textcat/contexts";
import TextcatComposer from "./textcat/composer";
import {
  defaultLang,
  defaultWrittenText,
  IntlText,
  Lang,
  LANGUAGES,
  newSentence,
  WrittenText
} from "../model";

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

  const translation = useMemo(() => {
    const translation: Partial<Record<Lang, IntlText>> = {};
    catalogs.forEach(catalog => {
      const { lang } = catalog;
      try {
        translation[lang] = catalog.translate(writtenTexts);
      } catch (e) {
        console.warn(e);
        translation[lang] = String(e);
      }
    });
    return translation;
  }, [catalogs, writtenTexts]);

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
        <TextcatComposer
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
      <table>
        {LANGUAGES.map(lang => (
          <tr key={lang}>
            <th class="pr-10">{lang}</th>
            <td>{translation[lang]}</td>
          </tr>
        ))}
      </table>
      <details open={false}>
        <pre>{JSON.stringify(writtenTexts, undefined, 2)}</pre>
      </details>
    </section>
  );
};

export default App;
