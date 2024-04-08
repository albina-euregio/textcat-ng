import { expect, it } from "vitest";
import { t } from ".";

it("should translate", () => {
  expect(t("en", "sentence")).toBe("Sentence");
  expect(t("en", "unknownLine", "foo", "bar")).toBe("Unknown line foo in bar!");
});
