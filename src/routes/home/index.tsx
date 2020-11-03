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
import { WrittenText, IntlText } from "../../model";

const Home: FunctionalComponent = () => {
  const [catalog, setCatalog] = useState<TextcatCatalog>(new Satzkatalog("de"));
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
      }
    }
  });
  useEffect(() => {
    buildTextcat().then(data => {
      setCatalog(data);
    });
  }, []);

  let translation: IntlText = { de: "" };
  try {
    translation = catalog.translate([writtenText]);
  } catch (e) {
    console.warn(e);
    translation = { de: String(e) };
  }
  console.log(translation);

  return (
    <div class={style.home}>
      <h1>Home</h1>
      <Catalog.Provider value={catalog}>
        <TextcatSentence
          writtenText={writtenText}
          setWrittenText={(newText: WrittenText): void =>
            setWrittenText(newText)
          }
        ></TextcatSentence>
      </Catalog.Provider>
      <pre>{JSON.stringify(writtenText, undefined, 2)}</pre>
      <q>{translation.de}</q>
    </div>
  );
};

export default Home;
