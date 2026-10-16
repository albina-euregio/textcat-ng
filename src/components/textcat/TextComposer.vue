<script setup lang="ts">
import { t } from "../../i18n";
import { WrittenPhrase } from "../../model/writtenText";
import CaretDownSquare from "../bootstrap-icons/caret-down-square.vue";
import CaretUpSquare from "../bootstrap-icons/caret-up-square.vue";
import Clipboard from "../bootstrap-icons/clipboard.vue";
import Copy from "../bootstrap-icons/copy.vue";
import XSquare from "../bootstrap-icons/x-square.vue";
import {
  catalog,
  copyToClipboard,
  isClipboardEnabled,
  moveButtons,
  moveSentence,
  pasteSentenceFromClipboard,
  readOnly,
  sentenceList,
  setWrittenPhrase,
  writtenText,
} from "../state";
import AllSentencesSelect from "./AllSentencesSelect.vue";
import FilterSentencesPane from "./FilterSentencesPane.vue";
import PhraseComposer from "./PhraseComposer.vue";
import { nextTick, ref, useTemplateRef } from "vue";

const sentencesSection = useTemplateRef("sentencesSection");
const announcement = ref("");

function onDragStart(index: number, event: DragEvent) {
  if (!event.dataTransfer) return;
  event.dataTransfer.setData("text", JSON.stringify(index));
  event.dataTransfer.dropEffect = "move";
}

function onDrop(index: number, event: DragEvent) {
  event.stopPropagation();
  event.preventDefault();
  const fromIndex = event.dataTransfer?.getData("text");
  if (fromIndex === undefined) return;
  moveSentence(+fromIndex, index);
}

async function onKeydown(index: number, event: KeyboardEvent) {
  if (readOnly.value || !event.altKey) return;
  const summary = event.target as HTMLElement;
  if (summary.parentElement !== event.currentTarget) return;
  const toIndex =
    event.key === "ArrowUp"
      ? index - 1
      : event.key === "ArrowDown"
        ? index + 1
        : undefined;
  if (toIndex === undefined) return;
  event.preventDefault();
  if (toIndex < 0 || toIndex >= writtenText.value.length) return;
  moveSentence(index, toIndex);
  announcement.value = t(
    "sentence.moved",
    toIndex + 1,
    writtenText.value.length,
  );
  await nextTick();
  sentencesSection.value
    ?.querySelectorAll<HTMLElement>(":scope > details > summary")
    [toIndex]?.focus();
}
</script>

<template>
  <section ref="sentencesSection">
    <p class="visually-hidden" aria-live="polite">{{ announcement }}</p>
    <AllSentencesSelect v-if="!readOnly && catalog && sentenceList" />
    <FilterSentencesPane v-if="!readOnly && catalog" />
    <h2>{{ t("heading.selectedSentences") }}</h2>
    <PhraseComposer
      v-for="(writtenPhrase, index) in writtenText"
      :key="index"
      :curly-name="writtenPhrase.curlyName"
      curly-name-suffix=""
      :model-value="writtenPhrase"
      :on-drag-start="onDragStart.bind(undefined, index)"
      :on-drop="onDrop.bind(undefined, index)"
      style="overflow-x: auto"
      @keydown="onKeydown(index, $event)"
      @update:model-value="
        (newText: WrittenPhrase) => setWrittenPhrase(newText, index)
      "
    >
      <button
        :disabled="!isClipboardEnabled"
        :title="t('sentence.copy')"
        :aria-label="t('sentence.copy')"
        @click="copyToClipboard(writtenPhrase)"
      >
        <Copy />
      </button>
      <button
        v-if="!readOnly"
        :disabled="!isClipboardEnabled"
        :title="t('sentence.paste')"
        :aria-label="t('sentence.paste')"
        @click="pasteSentenceFromClipboard(index)"
      >
        <Clipboard />
      </button>
      <button
        v-if="!readOnly && moveButtons"
        :disabled="index === 0"
        :title="t('sentence.moveUp')"
        :aria-label="t('sentence.moveUp')"
        @click="moveSentence(index, index - 1)"
      >
        <CaretUpSquare />
      </button>
      <button
        v-if="!readOnly && moveButtons"
        :disabled="index >= writtenText.length - 1"
        :title="t('sentence.moveDown')"
        :aria-label="t('sentence.moveDown')"
        @click="moveSentence(index, index + 1)"
      >
        <CaretDownSquare />
      </button>
      <button
        v-if="!readOnly"
        :title="t('sentence.remove')"
        :aria-label="t('sentence.remove')"
        class="x-square"
        @click="moveSentence(index, undefined)"
      >
        <XSquare />
      </button>
      {{ " " }}
    </PhraseComposer>
  </section>
</template>
