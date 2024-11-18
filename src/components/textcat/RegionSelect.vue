<script setup lang="ts">
import { t } from "../../i18n";
import { catalog, srcRegion } from "../state";
</script>

<template>
  <label>
    {{ `[${t("region")}: ` }}
    <select v-model="srcRegion">
      <option value=""></option>
      <option v-for="region in catalog?.regions" :key="region" :value="region">
        {{ region }}
      </option>
    </select>
    {{ "]" }}
  </label>
</template>
