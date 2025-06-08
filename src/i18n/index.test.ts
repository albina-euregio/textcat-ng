import { t } from ".";
import { srcLang } from "../components/state";
import { expect, it } from "vitest";

it("should translate", () => {
  srcLang.value = "en";
  expect(t("sentence")).toBe("Sentence");
  expect(t("unknownLine", "foo", "bar")).toBe("Unknown line foo in bar!");
});
