import { includeIgnoreFile } from "@eslint/compat";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import prettier from "eslint-config-prettier/flat";
import pluginVue from "eslint-plugin-vue";
import { fileURLToPath } from "node:url";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfigWithVueTs([
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  prettier,
]);
