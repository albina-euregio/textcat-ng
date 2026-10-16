<script setup lang="ts">
import { t } from "../../i18n";
import { showTranslation } from "../state";
</script>

<template>
  <label>
    {{ "[" }}
    <input v-model="showTranslation" type="checkbox" />
    {{ ` ${t("translations.show")}]` }}
  </label>
</template>
