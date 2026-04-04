import { t } from ".";
import { srcLang } from "../components/state";
import { expect, it } from "vite-plus/test";

it("should translate", () => {
  srcLang.value = "en";
  expect(t("sentence")).toBe("Sentence");
  expect(t("unknownLine", "foo", "bar")).toBe("Unknown line foo in bar!");
});
