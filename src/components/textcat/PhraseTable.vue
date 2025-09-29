<script setup lang="ts">
import {
  CurlyName,
  CurlyNameSuffix,
  isPhrase,
  Phrase,
  WrittenPhrase,
} from "../../model";
import SelectLine from "./SelectLine.vue";
import SelectedLine from "./SelectedLine.vue";

const writtenPhrase = defineModel<WrittenPhrase>({ required: true });

defineProps<{
  phrase: Phrase | undefined;
  curlyName: CurlyName;
  curlyNameSuffix: CurlyNameSuffix;
  onDragStart?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
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
      />
      <SelectedLine
        v-if="phrase"
        v-model="writtenPhrase"
        :phrase="phrase"
        :curlyName="curlyName"
        :curlyNameSuffix="curlyNameSuffix"
        :onDragStart="onDragStart"
        :onDrop="onDrop"
      />
    </tbody>
  </table>
</template>
