<script setup lang="ts">
import {
  CurlyName,
  CurlyNameSuffix,
  isPhrase,
  Phrase,
} from "../../model/phrase";
import { WrittenPhrase } from "../../model/writtenText";
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
        :curly-name="curlyName"
        :curly-name-suffix="curlyNameSuffix"
        :on-drag-start="onDragStart"
        :on-drop="onDrop"
      />
      <SelectedLine
        v-if="phrase"
        v-model="writtenPhrase"
        :phrase="phrase"
        :curly-name="curlyName"
        :curly-name-suffix="curlyNameSuffix"
        :on-drag-start="onDragStart"
        :on-drop="onDrop"
      />
    </tbody>
  </table>
</template>
