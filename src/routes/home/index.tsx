import { FunctionalComponent, h } from "preact";
import * as style from "./style.css";
import TextcatSentence from "../../components/textcat/sentence";
import { buildTextcat } from "../../components/textcat/satzkatalog";
import { useEffect, useState } from "preact/hooks";
import { Catalog, emptyCatalog } from "../../components/textcat/catalog";

const writtenText: WrittenSentenceOrPhrase[] = [
  {
    curlyName: "Verhältnisse04",
    line: -1, // not needed for sentence
    args: [
      {
        curlyName: "Verhältnisse04§wo_wann3",
        line: 0,
        args: []
      }
    ]
  }
];

const Home: FunctionalComponent = () => {
  const [catalog, setCatalog] = useState<TextcatCatalog>(emptyCatalog);
  useEffect(() => {
    buildTextcat().then(data => {
      setCatalog(data);
    });
  }, []);

  return (
    <div class={style.home}>
      <h1>Home</h1>
      <Catalog.Provider value={catalog}>
        <TextcatSentence sentence="Verhältnisse04"></TextcatSentence>
      </Catalog.Provider>
      <pre>{JSON.stringify(writtenText, undefined, 2)}</pre>
    </div>
  );
};

export default Home;
