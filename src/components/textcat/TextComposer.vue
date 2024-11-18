<script setup lang="ts">
import { t } from "../../i18n";
import { WrittenPhrase } from "../../model";
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
  writtenText
} from "../state";
import AllSentencesSelect from "./AllSentencesSelect.vue";
import FilterSentencesPane from "./FilterSentencesPane.vue";
import PhraseComposer from "./PhraseComposer.vue";

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
</script>

<template>
  <section>
    <AllSentencesSelect v-if="!readOnly && catalog && sentenceList" />
    <FilterSentencesPane v-if="!readOnly && catalog" />
    <h2>{{ t("heading.selectedSentences") }}</h2>
    <PhraseComposer
      v-for="(writtenPhrase, index) in writtenText"
      :key="index"
      :curlyName="writtenPhrase.curlyName"
      curlyNameSuffix=""
      :showError="true"
      :modelValue="writtenPhrase"
      @update:modelValue="
        (newText: WrittenPhrase) => setWrittenPhrase(newText, index)
      "
      :onDragStart="onDragStart.bind(undefined, index)"
      :onDrop="onDrop.bind(undefined, index)"
    >
      <button
        :disabled="!isClipboardEnabled"
        @click="copyToClipboard(writtenPhrase)"
        :title="t('sentence.copy')"
      >
        <Copy />
      </button>
      <button
        v-if="!readOnly"
        :disabled="!isClipboardEnabled"
        @click="pasteSentenceFromClipboard(index)"
        :title="t('sentence.paste')"
      >
        <Clipboard />
      </button>
      <button
        v-if="!readOnly && moveButtons"
        :disabled="index === 0"
        @click="moveSentence(index, index - 1)"
        :title="t('sentence.moveUp')"
      >
        <CaretUpSquare />
      </button>
      <button
        v-if="!readOnly && moveButtons"
        :disabled="index >= writtenText.length - 1"
        @click="moveSentence(index, index + 1)"
        :title="t('sentence.moveDown')"
      >
        <CaretDownSquare />
      </button>
      <button
        v-if="!readOnly"
        @click="moveSentence(index, undefined)"
        :title="t('sentence.remove')"
        class="x-square"
      >
        <XSquare />
      </button>
      {{ " " }}
    </PhraseComposer>
  </section>
</template>
