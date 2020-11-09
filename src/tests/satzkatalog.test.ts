import {
  Phrase,
  Sentence,
  Satzkatalog,
  WrittenText,
  arrayMove,
  mapLineFragment
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
      lineFragments: ["[Empty]"],
      region: undefined
    },
    {
      line: "abseits der Pisten",
      lineFragments: [
        "abseits der Pisten"
        // en: "for those venturing off piste",
        // it: "al di fuori delle piste,"
      ],
      region: undefined
    },
    {
      line: "abseits gesicherter Pisten",
      lineFragments: ["abseits gesicherter Pisten"],
      region: undefined
    },
    {
      line: "im {Exposition} {und_im_Exposition}",
      // en: "in {Exposition} {und_im_Exposition}",
      // it: "nelle {Exposition} {und_im_Exposition} (-),"
      lineFragments: ["im", "{Exposition}", "{und_im_Exposition}"],
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
      lineFragments: [
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

const textIT = `
ST_Header: Condizioni_04
ST_CurlyName: Verhältnisse04
PA_Pos: 1
PA_PosGerman: 1
RS_CurlyName: Verhältnisse04§wo_wann3
PA_Pos: 2
PA_PosGerman: 3
RS_CurlyName: Verhältnisse04§Lawinensituation.
PA_Pos: 3
PA_PosGerman: 2
RS_CurlyName: teils_gefährliche
PA_Pos: 4
PA_PosGerman: 0
RS_CurlyName: Punkt

RS_Header: situazione valanghe
RS_CurlyName: Verhältnisse04§Lawinensituation.
Line: la situazione valanghiva è

RS_Header: dove/quando
RS_CurlyName: Verhältnisse04§wo_wann3
Line: [Empty]
Line: al di fuori delle piste,
Line: al di fuori delle piste assicurate,
Line: nelle {Exposition} {und_im_Exposition} (-),
Line: {im_Gebiet} {im_Gebiet2_optional} {und_im_Gebiet} (-),

RS_Header: parzialmente pericolose
RS_CurlyName: teils_gefährliche
Line: {gebietsweise2} {gefährliche2}
Line: {zeitweise} {gefährliche}

RS_Header: a tratti
RS_CurlyName: zeitweise
Line: [Empty]
Line: ancora
Line: in parte ancora
Line: ancora

RS_Header: pericolosa
RS_CurlyName: gefährliche
Line: molto pericolosa
Line: pericolosa
Line: molto critica
Line: critica

RS_Header: Punkt
RS_CurlyName: Punkt
Line: (-).
`;

let catalog: Satzkatalog;
beforeAll(() => {
  catalog = new Satzkatalog("de").parse(text);
  expect(catalog.lang).toBe("de");
});
it("should return the correct sentence", () =>
  expect(catalog.sentence("Verhältnisse04")).toStrictEqual(sentence010));
it("should convert sentence to phrase", () =>
  expect(catalog.phrase("Verhältnisse04")).toStrictEqual(sentence010));
it("should return the correct phrase", () =>
  expect(catalog.phrase("Verhältnisse04§wo_wann3")).toStrictEqual(woWann3));
it("should return always return a unique phrase", () =>
  expect(catalog.getPhrase(writtenText, "Punkt")).toStrictEqual({
    curlyName: "Punkt",
    line: 0
  }));
it("should translate a text", () =>
  expect(catalog.translate([writtenText])).toBe(
    "Abseits gesicherter Pisten weiterhin sehr kritische Lawinensituation."
  ));
it("should translate a text to IT", () =>
  expect(new Satzkatalog("it").parse(textIT).translate([writtenText])).toBe(
    "Al di fuori delle piste assicurate, la situazione valanghiva è ancora molto critica."
  ));
it("should mapLineFragment for curlyName", () =>
  expect(
    mapLineFragment(
      "{foo}",
      (c, s) => `curlyName:${c.toUpperCase()} curlyNameSuffix:${s}`,
      () => ""
    )
  ).toBe("curlyName:FOO curlyNameSuffix:"));
it("should mapLineFragment for curlyNameNO", () =>
  expect(
    mapLineFragment(
      "{foo_NO}",
      (c, s) => `curlyName:${c.toUpperCase()} curlyNameSuffix:${s}`,
      () => ""
    )
  ).toBe("curlyName:FOO curlyNameSuffix:_NO"));
it("should mapLineFragment for constant", () =>
  expect(
    mapLineFragment(
      "constant text",
      () => "",
      c => `constant:${c}`
    )
  ).toBe("constant:constant text"));
it("should arrayMove", () => {
  const arr = [0, 1, 2, 3, 4, 5];
  expect(arrayMove(arr, 2)).toStrictEqual([0, 1, 3, 4, 5]);
  expect(arrayMove(arr, 2, 0)).toStrictEqual([2, 0, 1, 3, 4, 5]);
  expect(arrayMove(arr, 2, 1)).toStrictEqual([0, 2, 1, 3, 4, 5]);
  expect(arrayMove(arr, 2, 2)).toStrictEqual([0, 1, 2, 3, 4, 5]);
  expect(arrayMove(arr, 2, 3)).toStrictEqual([0, 1, 3, 2, 4, 5]);
  expect(arrayMove(arr, 2, 4)).toStrictEqual([0, 1, 3, 4, 2, 5]);
});
