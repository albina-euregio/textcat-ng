<script setup lang="ts">
import { t } from "../../i18n";
import { newJoker, newSentence, sentencePreview } from "../../model";
import BracesAsterisk from "../bootstrap-icons/braces-asterisk.vue";
import PlusSquare from "../bootstrap-icons/plus-square.vue";
import { addWrittenPhrase, catalog } from "../state";
import { ref } from "vue";

const curlyName = ref("");

const url =
  window.location != window.parent.location
    ? document.referrer
    : document.location.href;
const enableJoker =
  import.meta.env.DEV ||
  import.meta.env.VITE_DEEPL_API ||
  url.startsWith("https://admin.avalanche.report");
</script>

<template>
  <div v-if="catalog" class="block">
    <h2>{{ `${t("heading.allSentences")} ` }}</h2>
    <label v-if="enableJoker" class="d-flex mt-10">
      <button :title="t('sentence.add')" @click="addWrittenPhrase(newJoker())">
        <BracesAsterisk /> {{ t("sentence.joker") }}
      </button>
    </label>
    <label class="d-flex mt-10">
      <button
        :title="t('sentence.add')"
        :disabled="!curlyName"
        @click="addWrittenPhrase(newSentence(curlyName))"
      >
        <PlusSquare />
      </button>
      <select class="f-auto f-truncate sentences" v-model="curlyName">
        <option
          v-for="sentence in catalog.sentences"
          :key="sentence.curlyName"
          :value="sentence.curlyName"
        >
          {{ sentencePreview(sentence, catalog) }}
        </option>
      </select>
    </label>
  </div>
</template>
