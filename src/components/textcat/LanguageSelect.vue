<script setup lang="ts">
import { t } from "../../i18n";
import { LANGUAGES, Lang } from "../../model";
import { srcLang } from "../state";
</script>

<template>
  <label>
    {{ `[${t("language")}: ` }}
    <select
      :value="srcLang"
      @change="(e) => (srcLang = (e.target as HTMLSelectElement).value as Lang)"
    >
      <option v-for="lang in LANGUAGES" :key="lang" :value="lang">
        {{ lang }}
      </option>
    </select>
    {{ "]" }}
  </label>
</template>
