import { Phrase, Sentence } from "../model";

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
  $type: "Phrase",
  curlyName: "Verhältnisse04§wo_wann3",
  header: {
    de: "wo/wann",
    en: "where/when",
    it: "dove/quando"
  },
  lines: [
    {
      line: {
        de: "abseits der Pisten",
        en: "for those venturing off piste",
        it: "al di fuori delle piste,"
      }
    },
    {
      line: {
        de: "im {Exposition} {und_im_Exposition}",
        en: "in {Exposition} {und_im_Exposition}",
        it: "nelle {Exposition} {und_im_Exposition} (-),"
      },
      linePhrases: [
        // ...
      ]
    },
    {
      line: {
        de: "im selten befahrenen {Tourengelände}",
        en: "in little used {Tourengelände}",
        it: "nelle {Tourengelände} poco frequentate,"
      },
      linePhrases: [
        // ...
      ]
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
  $type: "Sentence",
  curlyName: "Verhältnisse04",
  header: {
    de: "Verhältnisse 04",
    en: "Conditions 04",
    it: "Condizioni 04"
  },
  phrases: [
    "Verhältnisse04§wo_wann3",
    "teils_gefährliche",
    "Verhältnisse04§Lawinensituation"
  ],
  pos: [1, 2, 3],
  posGerman: [1, 2, 3]
};
// equivalent to Phase with `Line: {Verhältnisse04§wo_wann3} {teils_gefährliche} {Verhältnisse04§Lawinensituation}`???

// legacy snowpackStructureCommentTextcat
// 33[6610,6817,562].
// 110[6144[10032,12051,10200],14929,8412,7520,4182,5890,9413].
// 22[5934,3740,5928,6441[12127,14870],1536,6420].
// 102[6664,6991,7596[7041,3796],7404,9749,10547,9413].
// 66[3002[3764,7815]]

console.log(woWann3);
console.log(sentence010);
it("should work", () => expect(1 + 1).toBe(2));
