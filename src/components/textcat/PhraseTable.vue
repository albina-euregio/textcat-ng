<script setup lang="ts">
import {
  CurlyName,
  CurlyNameSuffix,
  isPhrase,
  Phrase,
  WrittenPhrase
} from "../../model";
import SelectedLine from "./SelectedLine.vue";
import SelectLine from "./SelectLine.vue";

const writtenPhrase = defineModel<WrittenPhrase>({ required: true });

defineProps<{
  phrase: Phrase | undefined;
  curlyName: CurlyName;
  curlyNameSuffix: CurlyNameSuffix;
  onDragStart?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  showError?: boolean;
}>();
</script>

<template>
  <table>
    <tbody>
      <SelectLine
        v-if="isPhrase(phrase)"
        v-model="writtenPhrase"
        :phrase="phrase"
        :curlyName="curlyName"
        :curlyNameSuffix="curlyNameSuffix"
        :onDragStart="onDragStart"
        :onDrop="onDrop"
        :showError="showError"
      />
      <SelectedLine
        v-if="phrase"
        v-model="writtenPhrase"
        :phrase="phrase"
        :curlyName="curlyName"
        :curlyNameSuffix="curlyNameSuffix"
        :onDragStart="onDragStart"
        :onDrop="onDrop"
        :showError="showError"
      />
    </tbody>
  </table>
</template>
