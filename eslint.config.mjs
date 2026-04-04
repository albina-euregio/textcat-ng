import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import prettier from "eslint-config-prettier/flat";
import pluginVue from "eslint-plugin-vue";

export default defineConfigWithVueTs([
  { ignores: ["dist"] },
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  prettier,
]);
