import { setI18nLang, t } from "../i18n";

it("should translate", () => {
  setI18nLang("en");
  expect(t("sentence")).toBe("Sentence");
  expect(t("unknownLine", "foo", "bar")).toBe("Unknown line foo in bar!");
});
