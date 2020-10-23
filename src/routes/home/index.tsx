import { FunctionalComponent, h } from "preact";
import * as style from "./style.css";
import TextcatSentence from "../../components/textcat/sentence";

/**
 * > cat DE/Ranges/Verhältnisse04§wo_wann3.txt
 * RS_Header: wo/wann
 * RS_CurlyName: Verhältnisse04§wo_wann3
 * Line: abseits der Pisten
 * Line: im {Exposition} {und_im_Exposition}
 * Line: im selten befahrenen {Tourengelände}
 * Line: ...
 */
const woWann3: Phrase = {
  curlyName: "Verhältnisse04§wo_wann3",
  header: {
    de: "wo/wann",
    en: "where/when",
    it: "dove/quando"
  },
  lines: [
    {
      header: {
        de: "abseits der Pisten",
        en: "for those venturing off piste",
        it: "al di fuori delle piste,"
      }
    },
    {
      header: {
        de: "im {Exposition} {und_im_Exposition}",
        en: "in {Exposition} {und_im_Exposition}",
        it: "nelle {Exposition} {und_im_Exposition} (-),"
      }
    },
    {
      header: {
        de: "im selten befahrenen {Tourengelände}",
        en: "in little used {Tourengelände}",
        it: "nelle {Tourengelände} poco frequentate,"
      }
    }
  ]
};

/**
 * > cat DE/Sentences/S010.txt
 * ST_Header: Verhältnisse 04
 * ST_CurlyName: Verhältnisse04
 * PA_Pos: 1
 * PA_PosGerman: 1
 * RS_CurlyName: Verhältnisse04§wo_wann3
 * PA_Pos: 2
 * PA_PosGerman: 2
 * RS_CurlyName: teils_gefährliche
 * PA_Pos: 3
 * PA_PosGerman: 3
 * RS_CurlyName: Verhältnisse04§Lawinensituation.
 */
const sentence010: Sentence = {
  curlyName: "Verhältnisse04",
  header: {
    de: "Verhältnisse 04",
    en: "Conditions 04",
    it: "Condizioni 04"
  },
  phrases: [woWann3, "teils_gefährliche", "Verhältnisse04§Lawinensituation"],
  pos: [1, 2, 3],
  posGerman: [1, 2, 3]
};

const Home: FunctionalComponent = () => {
  return (
    <div class={style.home}>
      <h1>Home</h1>
      <p>This is the Home component.</p>
      <TextcatSentence sentence={sentence010}></TextcatSentence>
    </div>
  );
};

export default Home;
