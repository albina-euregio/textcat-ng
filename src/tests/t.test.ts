import { setI18nLang, t } from "../i18n";

it("should translate", () => {
  setI18nLang("en");
  expect(t("sentence")).toBe("Sentence");
  expect(t("unsetPhrase", "foo", "bar")).toBe("Unset phrase foo in bar!");
});
