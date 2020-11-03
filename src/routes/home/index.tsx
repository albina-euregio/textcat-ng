import { FunctionalComponent, h } from "preact";
import * as style from "./style.css";
import TextcatSentence from "../../components/textcat/sentence";
import {
  buildTextcat,
  Satzkatalog,
  TextcatCatalog
} from "../../model/satzkatalog";
import { useEffect, useState } from "preact/hooks";
import { Catalog } from "../../components/textcat/catalog";
import { WrittenText, IntlText, Lang } from "../../model";

const Home: FunctionalComponent = () => {
  const [srcLang, setSrcLang] = useState<Lang>("de");
  const [catalog, setCatalog] = useState<TextcatCatalog>(
    new Satzkatalog(srcLang)
  );
  const [catalogs, setCatalogs] = useState<TextcatCatalog[]>([]);
  const [writtenText, setWrittenText] = useState<WrittenText>({
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
  });

  useEffect(() => {
    buildTextcat(srcLang).then(c => setCatalog(c));
  }, [srcLang]);
  const addCatalog = (c: TextcatCatalog): void => setCatalogs(cs => [c, ...cs]);
  useEffect(() => {
    buildTextcat("de").then(c => addCatalog(c));
    buildTextcat("en").then(c => addCatalog(c));
    buildTextcat("it").then(c => addCatalog(c));
  }, []);

  const translation: IntlText = {};
  catalogs.forEach(catalog => {
    const { lang } = catalog;
    try {
      translation[lang] = catalog.translate([writtenText])[lang];
    } catch (e) {
      console.warn(e);
      translation[lang] = String(e);
    }
  });

  return (
    <div class={style.home}>
      <h1>textcat-ng</h1>
      <label>
        srcLang:{" "}
        <select
          value={srcLang}
          onChange={(e): void =>
            setSrcLang((e.target as HTMLSelectElement).value as Lang)
          }
        >
          <option value="de">de</option>
          <option value="en">en</option>
          <option value="it">it</option>
        </select>
      </label>
      <Catalog.Provider value={catalog}>
        <TextcatSentence
          writtenText={writtenText}
          setWrittenText={(newText: WrittenText): void =>
            setWrittenText(newText)
          }
        ></TextcatSentence>
      </Catalog.Provider>
      <pre>{JSON.stringify(writtenText, undefined, 2)}</pre>
      <pre>{JSON.stringify(translation, undefined, 2)}</pre>
    </div>
  );
};

export default Home;
