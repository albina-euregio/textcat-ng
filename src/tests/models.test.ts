import { Phrase, Sentence, Satzkatalog, WrittenText } from "../model";

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
  header: "wo/wann",
  // en: "where/when",
  // it: "dove/quando"
  lines: [
    {
      line: {
        de: "[Empty]"
      },
      linePhrases: [
        {
          de: "[Empty]"
        }
      ],
      region: undefined
    },
    {
      line: {
        de: "abseits der Pisten"
      },
      linePhrases: [
        {
          de: "abseits der Pisten"
          // en: "for those venturing off piste",
          // it: "al di fuori delle piste,"
        }
      ],
      region: undefined
    },
    {
      line: {
        de: "abseits gesicherter Pisten"
      },
      linePhrases: [
        {
          de: "abseits gesicherter Pisten"
        }
      ],
      region: undefined
    },
    {
      line: {
        de: "im {Exposition} {und_im_Exposition}"
        // en: "in {Exposition} {und_im_Exposition}",
        // it: "nelle {Exposition} {und_im_Exposition} (-),"
      },
      linePhrases: [
        {
          de: "im "
        },
        {
          de: "{Exposition}"
        },
        {
          de: " "
        },
        {
          de: "{und_im_Exposition}"
        }
      ],
      region: undefined
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
  header: "Verhältnisse_04",
  // en: "Conditions 04",
  // it: "Condizioni 04"
  phrases: [
    "Verhältnisse04§wo_wann3",
    "teils_gefährliche",
    "Verhältnisse04§Lawinensituation."
  ],
  pos: [1, 2, 3],
  posGerman: [1, 2, 3]
};
// equivalent to Phase with `Line: {Verhältnisse04§wo_wann3} {teils_gefährliche} {Verhältnisse04§Lawinensituation}`???

const writtenText: WrittenText = {
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
};

// legacy snowpackStructureCommentTextcat
// 33[6610,6817,562].
// 110[6144[10032,12051,10200],14929,8412,7520,4182,5890,9413].
// 22[5934,3740,5928,6441[12127,14870],1536,6420].
// 102[6664,6991,7596[7041,3796],7404,9749,10547,9413].
// 66[3002[3764,7815]]

const text = `
ST_Header: Verhältnisse_04
ST_CurlyName: Verhältnisse04
PA_Pos: 1
PA_PosGerman: 1
RS_CurlyName: Verhältnisse04§wo_wann3
PA_Pos: 2
PA_PosGerman: 2
RS_CurlyName: teils_gefährliche
PA_Pos: 3
PA_PosGerman: 3
RS_CurlyName: Verhältnisse04§Lawinensituation.

RS_Header: wo/wann
RS_CurlyName: Verhältnisse04§wo_wann3
Line: [Empty]
Line: abseits der Pisten
Line: abseits gesicherter Pisten
Line: im {Exposition} {und_im_Exposition}

RS_Header: teils gefährliche
RS_CurlyName: teils_gefährliche
Line: {gebietsweise2} {gefährliche2}
Line: {zeitweise} {gefährliche}

RS_Header: zeitweise
RS_CurlyName: zeitweise
Line: [Empty]
Line: weiterhin
Line: weiterhin teils
Line: noch

RS_Header: gefährliche
RS_CurlyName: gefährliche
Line: sehr gefährliche
Line: gefährliche
Line: sehr kritische
Line: kritische

RS_Header: Lawinensituation.
RS_CurlyName: Verhältnisse04§Lawinensituation.
Line: Lawinensituation.
`;

let catalog: Satzkatalog;
beforeAll(() => {
  catalog = new Satzkatalog("de");
  expect(catalog.lang).toBe("de");
  catalog.parse(text, "de");
});
it("should return the correct sentence", () =>
  expect(catalog.sentence("Verhältnisse04")).toStrictEqual(sentence010));
it("should return the correct phrase", () =>
  expect(catalog.phrase("Verhältnisse04§wo_wann3")).toStrictEqual(woWann3));
it("should translate a text", () =>
  expect(catalog.translate([writtenText]).de).toBe(
    "abseits gesicherter Pisten weiterhin   sehr kritische Lawinensituation."
  ));
