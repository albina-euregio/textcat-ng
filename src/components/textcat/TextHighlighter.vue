<script setup lang="ts">
import { searchWords } from "../state";
import { findAll } from "highlight-words-core";
import { computed } from "vue";

const props = defineProps<{
  text: string;
}>();

const chunks = computed(() =>
  findAll({
    textToHighlight: props.text,
    searchWords: searchWords.value ?? [],
  }),
);
</script>

<template>
  <template v-if="!searchWords?.length">{{ text }}</template>
  <template v-else>
    <template v-for="chunk in chunks">
      <mark v-if="chunk.highlight" :key="chunk.start">
        {{ text.slice(chunk.start, chunk.end) }}
      </mark>
      <template v-else>{{ text.slice(chunk.start, chunk.end) }}</template>
    </template>
  </template>
</template>
