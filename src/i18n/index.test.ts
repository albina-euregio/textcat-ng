import { t } from ".";
import { srcLang } from "../components/state";
import { expect, it } from "vite-plus/test";

it("should translate", () => {
  srcLang.value = "en";
  expect(t("sentence")).toBe("Sentence");
  expect(t("unknownLine", "foo", "bar")).toBe("Unknown line foo in bar!");
});

it("should fall back to English for untranslated messages", () => {
  srcLang.value = "fr";
  expect(t("sentence.add")).toBe("Ajouter une phrase");
  // empty string from Transifex
  expect(t("sentence.copy")).toBe("Copy sentence");
  // missing key
  expect(t("loading")).toBe("Loading text catalogue…");
});
