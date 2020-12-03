import preactRefresh from "@prefresh/vite";
import { UserConfig } from "vite";

import { execSync } from "child_process";
function git(command): string {
  return execSync(`git ${command}`, { encoding: "utf8" }).trim();
}
const VITE_GIT_VERSION = [
  git("describe --always"),
  git("log -1 --format=%ad --date=iso").substring(0, 10)
].join(", ");

const config: UserConfig = {
  base: "./",
  assetsDir: "assets",
  env: {
    VITE_GIT_VERSION
  },
  jsx: {
    factory: "h",
    fragment: "Fragment"
  },
  plugins: [preactRefresh()]
};

export default config;
