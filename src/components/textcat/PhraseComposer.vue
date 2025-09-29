<script setup lang="ts">
import { t } from "../../i18n";
import {
  CurlyName,
  CurlyNameSuffix,
  isJoker,
  isPhrase,
  Phrase,
  WrittenPhrase
} from "../../model";
import BracesAsterisk from "../bootstrap-icons/braces-asterisk.vue";
import { catalog, readOnly, headerOrCurlyName } from "../state";
import JokerComposer from "./JokerComposer.vue";
import PhraseTable from "./PhraseTable.vue";
import TextHighlighter from "./TextHighlighter.vue";
import { computed, ref } from "vue";

const props = defineProps<{
  curlyName: CurlyName;
  curlyNameSuffix: CurlyNameSuffix;
  onDragStart?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  showError?: boolean;
}>();

const writtenPhrase = defineModel<WrittenPhrase>({ required: true });

const phrase = computed((): Phrase | undefined =>
  catalog.value?.phrase(props.curlyName + props.curlyNameSuffix)
);

const summary = computed(
  (): string =>
    catalog.value?.previewPhrase(
      writtenPhrase.value,
      props.curlyNameSuffix,
      props.showError,
      headerOrCurlyName.value
    ) ?? ""
);

const isDragOver = ref(false);
const isOpen = ref(isPhrase(phrase.value) || isJoker(writtenPhrase.value));
</script>

<template>
  <details
    v-if="phrase || isJoker(writtenPhrase)"
    :open="isOpen"
    @toggle="isOpen = ($event.target as HTMLDetailsElement).open"
    :class="isDragOver ? 'block dragover' : 'block'"
  >
    <summary
      :draggable="!!props.onDragStart"
      @dragstart="props.onDragStart"
      @dragenter="() => (isDragOver = true)"
      @dragleave="() => (isDragOver = false)"
      @dragover="event => event.preventDefault()"
      @drop="
        event => {
          isDragOver = false;
          props.onDrop?.(event);
        }
      "
    >
      <slot />
      <abbr v-if="isJoker(writtenPhrase)" :title="t('sentence.joker')">
        <BracesAsterisk />
      </abbr>
      <TextHighlighter :text="summary" />
    </summary>

    <template v-if="isOpen">
      <template v-if="readOnly"></template>
      <JokerComposer
        v-else-if="isJoker(writtenPhrase)"
        v-model="writtenPhrase"
      />
      <PhraseTable
        v-else-if="phrase"
        v-model="writtenPhrase"
        :phrase="phrase"
        :curlyName="curlyName"
        :curlyNameSuffix="curlyNameSuffix"
        :showError="showError"
      />
    </template>
  </details>
</template>
