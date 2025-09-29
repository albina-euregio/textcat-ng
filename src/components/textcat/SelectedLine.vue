<script setup lang="ts">
import {
  CurlyName,
  CurlyNameSuffix,
  FULL_STOP,
  isJoker,
  mapLineFragment,
  newPhrase,
  Phrase,
  withPhrase,
  WrittenPhrase,
} from "../../model";
import PhraseComposer from "./PhraseComposer.vue";
import { computed } from "vue";

const props = defineProps<{
  phrase: Phrase | undefined;
  curlyName: CurlyName;
  curlyNameSuffix: CurlyNameSuffix;
  onDragStart?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  showError?: boolean;
}>();

const writtenPhrase = defineModel<WrittenPhrase>({ required: true });

const line = computed(() =>
  props.phrase!.lines.length === 1 ? 0 : writtenPhrase.value.line,
);

const selectedLine = computed(() => props.phrase!.lines[line.value]);

const lineFragments = computed(() =>
  selectedLine.value?.lineFragments
    ?.filter((lineFragment) => lineFragment !== FULL_STOP)
    ?.map((lineFragment, index) =>
      mapLineFragment(
        lineFragment,
        (curlyName, curlyNameSuffix) => ({ curlyName, curlyNameSuffix, index }),
        () => undefined,
      ),
    ),
);
</script>

<template>
  <tr v-if="!isJoker(writtenPhrase)">
    <td v-for="lineFragment in lineFragments" :key="lineFragment?.index">
      <PhraseComposer
        v-if="lineFragment"
        :curlyName="lineFragment.curlyName"
        :curlyNameSuffix="lineFragment.curlyNameSuffix"
        :modelValue="
          writtenPhrase?.args?.[lineFragment.curlyName] ??
          newPhrase(lineFragment.curlyName)
        "
        @update:modelValue="
          (newPhrase: WrittenPhrase) => {
            writtenPhrase = withPhrase(writtenPhrase, newPhrase);
          }
        "
      />
    </td>
  </tr>
</template>
