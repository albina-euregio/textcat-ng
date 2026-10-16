import { t, translate } from ".";
import { srcLang } from "../components/state";
import { expect, it } from "vite-plus/test";

it("should translate", () => {
  srcLang.value = "en";
  expect(t("sentence")).toBe("Sentence");
  expect(t("unknownLine", "foo", "bar")).toBe("Unknown line foo in bar!");
});

it("should fall back to English for untranslated messages", () => {
  const messages = {
    "sentence.add": "Ajouter une phrase",
    "sentence.copy": "",
  };
  expect(translate(messages, "sentence.add")).toBe("Ajouter une phrase");
  // empty string from Transifex
  expect(translate(messages, "sentence.copy")).toBe("Copy sentence");
  // missing key
  expect(translate(messages, "loading")).toBe("Loading text catalogue…");
  // missing language
  expect(translate(undefined, "undo")).toBe("Undo");
});
