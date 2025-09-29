<script setup lang="ts">
import { t } from "../../i18n";
import {
  CurlyName,
  newSentence,
  SearchMode,
  Sentence,
  WrittenPhrase,
} from "../../model";
import Filter from "../bootstrap-icons/filter.vue";
import PlusSquare from "../bootstrap-icons/plus-square.vue";
import Search from "../bootstrap-icons/search.vue";
import {
  addWrittenPhrase,
  catalog,
  searchText,
  searchTextDebounced,
} from "../state";
import PhraseComposer from "./PhraseComposer.vue";
import { computed, ref } from "vue";

const searchMode = ref(SearchMode.WORDS);

const writtenPhrases = ref<Record<CurlyName, WrittenPhrase>>(
  Object.fromEntries(
    catalog.value!.sentences.map(({ curlyName }) => [
      curlyName,
      newSentence(curlyName),
    ]),
  ),
);

const filteredSentences = computed((): Sentence[] => {
  return searchTextDebounced.value
    ? catalog.value!.searchSentences(
        searchTextDebounced.value,
        searchMode.value,
      )
    : [];
});
</script>

<template>
  <div class="block">
    <h2>{{ `${t("heading.searchSentences")} ` }}</h2>
    <label class="d-flex">
      <span class="pr-10">{{ `${t("search")}:` }}</span>
      <button
        :title="t('sentence.search')"
        @click="searchMode = SearchMode.WORDS"
      >
        <Filter />
      </button>
      <button
        :title="t('sentence.search.prefix')"
        @click="searchMode = SearchMode.PREFIX"
      >
        <Search />
      </button>
      <input class="f-auto sentences" type="text" v-model="searchText" />
    </label>
    <PhraseComposer
      v-for="sentence in filteredSentences"
      :key="sentence.curlyName"
      v-model="writtenPhrases[sentence.curlyName]"
      :curlyName="sentence.curlyName"
      curlyNameSuffix=""
    >
      <button
        :title="t('sentence.add')"
        @click="
          addWrittenPhrase(writtenPhrases[sentence.curlyName]);
          writtenPhrases[sentence.curlyName] = newSentence(sentence.curlyName);
          searchText = '';
        "
      >
        <PlusSquare />
      </button>
      {{ " " }}
    </PhraseComposer>
  </div>
</template>
