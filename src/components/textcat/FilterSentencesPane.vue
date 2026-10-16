<script setup lang="ts">
import { t } from "../../i18n";
import { CurlyName } from "../../model/phrase";
import { Sentence } from "../../model/sentence";
import { SearchMode } from "../../model/textCatalogue";
import { newSentence, WrittenPhrase } from "../../model/writtenText";
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
        :aria-pressed="searchMode === SearchMode.WORDS"
        @click="searchMode = SearchMode.WORDS"
      >
        <Filter /> {{ t("search.words") }}
      </button>
      <button
        :title="t('sentence.search.prefix')"
        :aria-pressed="searchMode === SearchMode.PREFIX"
        @click="searchMode = SearchMode.PREFIX"
      >
        <Search /> {{ t("search.prefix") }}
      </button>
      <input
        v-model="searchText"
        :aria-label="t('search')"
        class="f-auto sentences"
        type="search"
      />
    </label>
    <p
      v-if="searchTextDebounced && !filteredSentences.length"
      class="empty"
      role="status"
    >
      {{ t("search.noResults") }}
    </p>
    <PhraseComposer
      v-for="sentence in filteredSentences"
      :key="sentence.curlyName"
      v-model="writtenPhrases[sentence.curlyName]"
      :curly-name="sentence.curlyName"
      curly-name-suffix=""
    >
      <button
        :title="t('sentence.add')"
        :aria-label="t('sentence.add')"
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
