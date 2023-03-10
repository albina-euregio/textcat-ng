import { expect, it } from "vitest";
import { setI18nLang, t } from ".";

it("should translate", () => {
  setI18nLang("en");
  expect(t("sentence")).toBe("Sentence");
  expect(t("unknownLine", "foo", "bar")).toBe("Unknown line foo in bar!");
});
