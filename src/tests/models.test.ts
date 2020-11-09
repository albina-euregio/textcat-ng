import {
  Phrase,
  Sentence,
  Satzkatalog,
  WrittenText,
  mapLinePhrase
} from "../model";

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
      line: "[Empty]",
      linePhrases: ["[Empty]"],
      region: undefined
    },
    {
      line: "abseits der Pisten",
      linePhrases: [
        "abseits der Pisten"
        // en: "for those venturing off piste",
        // it: "al di fuori delle piste,"
      ],
      region: undefined
    },
    {
      line: "abseits gesicherter Pisten",
      linePhrases: ["abseits gesicherter Pisten"],
      region: undefined
    },
    {
      line: "im {Exposition} {und_im_Exposition}",
      // en: "in {Exposition} {und_im_Exposition}",
      // it: "nelle {Exposition} {und_im_Exposition} (-),"
      linePhrases: ["im", "{Exposition}", "{und_im_Exposition}"],
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
  lines: [
    {
      line: "",
      linePhrases: [
        "{Verhältnisse04§wo_wann3}",
        "{teils_gefährliche}",
        "{Verhältnisse04§Lawinensituation.}"
      ]
    }
  ]
};
// equivalent to Phase with `Line: {Verhältnisse04§wo_wann3} {teils_gefährliche} {Verhältnisse04§Lawinensituation}`???

const writtenText: WrittenText = {
  curlyName: "Verhältnisse04",
  line: 0,
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

RS_Header: Punkt
RS_CurlyName: Punkt
Line: (-).
`;

let catalog: Satzkatalog;
beforeAll(() => {
  catalog = new Satzkatalog("de");
  expect(catalog.lang).toBe("de");
  catalog.parse(text);
});
it("should return the correct sentence", () =>
  expect(catalog.sentence("Verhältnisse04")).toStrictEqual(sentence010));
it("should not convert sentence to phrase when disabled", () =>
  expect(catalog.phrase("Verhältnisse04", false)).toBeUndefined());
it("should convert sentence to phrase", () =>
  expect(catalog.phrase("Verhältnisse04")).toStrictEqual({
    $type: "Phrase",
    curlyName: "Verhältnisse04",
    header: "Verhältnisse_04",
    lines: [
      {
        line: "",
        linePhrases: [
          "{Verhältnisse04§wo_wann3}",
          "{teils_gefährliche}",
          "{Verhältnisse04§Lawinensituation.}"
        ]
      }
    ]
  }));
it("should return the correct phrase", () =>
  expect(catalog.phrase("Verhältnisse04§wo_wann3")).toStrictEqual(woWann3));
it("should return always return a unique phrase", () =>
  expect(catalog.getPhrase(writtenText, "Punkt")).toStrictEqual({
    curlyName: "Punkt",
    line: 0
  }));
it("should translate a text", () =>
  expect(catalog.translate([writtenText])).toBe(
    "abseits gesicherter Pisten weiterhin sehr kritische Lawinensituation."
  ));
it("should mapLinePhrase for curlyName", () =>
  expect(
    mapLinePhrase(
      "{foo}",
      (c, s) => `curlyName:${c.toUpperCase()} curlyNameSuffix:${s}`,
      () => ""
    )
  ).toBe("curlyName:FOO curlyNameSuffix:undefined"));
it("should mapLinePhrase for curlyNameNO", () =>
  expect(
    mapLinePhrase(
      "{foo_NO}",
      (c, s) => `curlyName:${c.toUpperCase()} curlyNameSuffix:${s}`,
      () => ""
    )
  ).toBe("curlyName:FOO curlyNameSuffix:_NO"));
it("should mapLinePhrase for constant", () =>
  expect(
    mapLinePhrase(
      "constant text",
      () => "",
      c => `constant:${c}`
    )
  ).toBe("constant:constant text"));
