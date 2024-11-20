<script setup lang="ts">
import { computed } from "vue";
import {
  CurlyName,
  CurlyNameSuffix,
  Phrase,
  withLine,
  WrittenPhrase
} from "../../model";
import { catalog, srcRegion } from "../state";
import TextHighlighter from "./TextHighlighter.vue";

const writtenPhrase = defineModel<WrittenPhrase>({ required: true });

const props = defineProps<{
  phrase: Phrase | undefined;
  curlyName: CurlyName;
  curlyNameSuffix: CurlyNameSuffix;
  onDragStart?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  showError?: boolean;
}>();

const line = computed<number>(() =>
  props.phrase?.lines.length === 1 ? 0 : writtenPhrase.value.line
);
const isRegionVisible = (region?: string): boolean =>
  !region || !srcRegion.value || srcRegion.value === region;

const size = computed(() =>
  line.value >= 0
    ? 1
    : (props.phrase?.lines ?? []).filter(line => isRegionVisible(line.region))
        .length + 1
);

function setWrittenPhrase(e: Event): void {
  const line = +(e.target as HTMLSelectElement).value;
  writtenPhrase.value = withLine(writtenPhrase.value, line);
}
</script>

<template>
  <tr>
    <td :colSpan="99">
      <select
        :size="size"
        :disabled="phrase?.lines.length === 1"
        :value="line"
        @change="setWrittenPhrase"
      >
        <option :value="-1"></option>
        <option
          v-for="(line, lineIndex) in phrase?.lines"
          v-show="isRegionVisible(line.region)"
          :key="line.line"
          :value="lineIndex"
        >
          <TextHighlighter
            v-if="catalog"
            :text="catalog.translateLineFragments(line.lineFragments)"
          />
        </option>
      </select>
    </td>
  </tr>
</template>
