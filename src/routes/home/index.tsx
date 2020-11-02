import { FunctionalComponent, h } from "preact";
import * as style from "./style.css";
import TextcatSentence from "../../components/textcat/sentence";
import {
  buildTextcat,
  Satzkatalog
} from "../../components/textcat/satzkatalog";
import { useEffect, useState } from "preact/hooks";
import { Catalog } from "../../components/textcat/catalog";
import { newSentence } from "../../components/textcat/writtenText";

const Home: FunctionalComponent = () => {
  const [catalog, setCatalog] = useState<TextcatCatalog>(new Satzkatalog());
  const [writtenText, setWrittenText] = useState<WrittenText>(
    newSentence("Verhältnisse04")
  );
  useEffect(() => {
    buildTextcat().then(data => {
      setCatalog(data);
    });
  }, []);

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
    </div>
  );
};

export default Home;
