import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import prettier from "eslint-config-prettier/flat";
import oxlint from "eslint-plugin-oxlint";
import pluginVue from "eslint-plugin-vue";

export default defineConfigWithVueTs([
  { ignores: ["dist"] },
  pluginVue.configs["flat/recommended"],
  vueTsConfigs.recommended,
  prettier,
  ...oxlint.configs["flat/recommended"], // oxlint should be the last one
]);
