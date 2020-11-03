import { FunctionalComponent, h } from "preact";
import {
  buildTextcat,
  Satzkatalog,
  TextcatCatalog
} from "../../model/satzkatalog";
import { useEffect, useState } from "preact/hooks";
import { Catalog } from "../../components/textcat/catalog";
import TextcatComposer from "../../components/textcat/composer";
import {
  IntlText,
  Lang,
  LANGUAGES,
  newSentence,
  WrittenText
} from "../../model";

const Home: FunctionalComponent = () => {
  const [srcLang, setSrcLang] = useState<Lang>("de");
  const [catalog, setCatalog] = useState<TextcatCatalog>(
    new Satzkatalog(srcLang)
  );
  const [catalogs, setCatalogs] = useState<TextcatCatalog[]>([]);
  const [writtenTexts, setWrittenTexts] = useState<WrittenText[]>([
    {
      curlyName: "Verhältnisse04",
      line: -999,
      args: {
        "Verhältnisse04§wo_wann3": {
          curlyName: "Verhältnisse04§wo_wann3",
          line: 2
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        teils_gefährliche: {
          curlyName: "teils_gefährliche",
          line: 1,
          args: {
            zeitweise: {
              curlyName: "zeitweise",
              line: 1
            },
            gefährliche: {
              curlyName: "gefährliche",
              line: 2
            }
          }
        },
        "Verhältnisse04§Lawinensituation.": {
          curlyName: "Verhältnisse04§Lawinensituation.",
          line: 0
        },
        Punkt: {
          curlyName: "Punkt",
          line: 0
        }
      }
    }
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

  const translation: IntlText = {};
  catalogs.forEach(catalog => {
    const { lang } = catalog;
    try {
      translation[lang] = catalog.translate(writtenTexts)[lang];
    } catch (e) {
      console.warn(e);
      translation[lang] = String(e);
    }
  });

  return (
    <section>
      <h1>
        <abbr title="text catalog: new generation">textcat-ng</abbr>
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

      <Catalog.Provider value={catalog}>
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
      </Catalog.Provider>

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

export default Home;
