import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { execSync } from "child_process";
function git(command: string): string {
  return execSync(`git ${command}`, { encoding: "utf8" }).trim();
}

process.env.VITE_TEXTCAT_EDITOR ??= "0";
process.env.VITE_GIT_VERSION = [
  git("describe --always"),
  git("log -1 --format=%ad --date=short")
].join(", ");

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: { sourcemap: true },
  plugins: [vue()]
});
