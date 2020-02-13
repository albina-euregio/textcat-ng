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

console.log(woWann3);
console.log(sentence010);
