<script setup lang="ts">
import { t } from "../../i18n";
import { showTranslation } from "../state";
</script>

<template>
  <label>
    {{ "[" }}
    <input type="checkbox" v-model="showTranslation" />
    {{ ` ${t("translations.show")}]` }}
  </label>
</template>
