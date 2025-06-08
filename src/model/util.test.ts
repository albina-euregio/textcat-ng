import { longestCommonPrefix } from ".";
import { expect, it } from "vitest";

it("should find the longest common prefix", () => {
  expect(longestCommonPrefix()).toBe("");
  expect(longestCommonPrefix("a", "b", "c")).toBe("");
  expect(longestCommonPrefix("aa", "ab", "ac")).toBe("a");
  expect(longestCommonPrefix("aaaa", "aab", "aaaac")).toBe("aa");
  expect(longestCommonPrefix("abaa", "aab", "aaaac")).toBe("a");
  expect(longestCommonPrefix(" abaa", " aab", " aaaac")).toBe(" a");
  expect(longestCommonPrefix("a", "a", "a")).toBe("a");
  expect(longestCommonPrefix("abcd", "abcd", "abcd")).toBe("abcd");
  expect(longestCommonPrefix("", "", "")).toBe("");
  expect(longestCommonPrefix("snow-danger", "snow-fun", "snow-mobile")).toBe(
    "snow-"
  );
});
