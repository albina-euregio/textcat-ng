<script setup lang="ts">
import { computed, nextTick } from "vue";
import { t } from "../../i18n";
import { Lang, Sentence } from "../../model";
import PlusSquare from "../bootstrap-icons/plus-square.vue";
import { catalog, catalogs } from "../state";
import {
  headerOrCurlyName,
  phraseCurlyName,
  sentenceCurlyName
} from "./editor-state";

const sentenceLangs = computed(() =>
  Object.values(catalogs.value!.catalogs).map(c => ({
    lang: c.lang,
    phrase: c.sentence(sentenceCurlyName.value)
  }))
);

const usages = computed(() =>
  (sentenceLangs.value[0].phrase?.lines[0].lineFragments ?? []).map(f => ({
    curlyName: f.slice(1, -1)
  }))
);

function addSentence() {
  const curlyName = prompt("curlyName");
  if (!curlyName) return;
  sentenceLangs.value.forEach(({ lang }) =>
    onSentenceChange(lang, {
      $type: "Sentence",
      header: curlyName,
      curlyName,
      lines: [
        {
          line: "",
          lineFragments: []
        }
      ]
    })
  );
}

async function onSentenceChange(lang: Lang, phrase: Sentence) {
  catalogs.value = await catalogs.value!.changePhrase(lang, phrase);
}
</script>

<template>
  <div class="block" style="max-height: 30vh; overflow-y: scroll">
    <h2>
      {{ t("editor.sentence") }}{{ " " }}
      <small>
        <button :title="t('sentence.add')" @click="addSentence">
          <PlusSquare />
        </button>
      </small>
    </h2>

    <div>
      <label>
        <input v-model="headerOrCurlyName" type="radio" value="header" />
        header
      </label>
      <label>
        <input v-model="headerOrCurlyName" type="radio" value="curlyName" />
        curlyName
      </label>
    </div>

    <label class="d-flex mt-10">
      <select class="f-auto f-truncate" v-model="sentenceCurlyName">
        <option value=""></option>
        <option
          v-for="phrase in catalog!.sentences"
          :key="phrase.curlyName"
          :value="phrase.curlyName"
        >
          {{ phrase[headerOrCurlyName] }}
        </option>
      </select>
    </label>
    <label class="d-flex">
      <span class="pr-10">{{ t("phrases") }}:</span>
      <ul class="inline">
        <li
          v-for="p in usages"
          :key="p.curlyName"
          @click="() => (phraseCurlyName = p.curlyName)"
          :style="{ cursor: 'pointer' }"
        >
          {{ p.curlyName }}
        </li>
      </ul>
    </label>
    <table
      v-if="sentenceLangs.some(({ phrase }) => phrase)"
      style='{ width: "100%" }'
    >
      <tbody>
        <tr v-for="{ lang, phrase } in sentenceLangs" :key="lang">
          <td>
            <input
              v-if="phrase"
              :style="{
                width: '100%',
                minWidth: `${phrase[headerOrCurlyName].length}ex`
              }"
              type="text"
              v-model="phrase[headerOrCurlyName]"
              @change="nextTick(() => onSentenceChange(lang, phrase))"
            />
          </td>
          <th class="pr-10" style="{ width: 0 }">
            {{ lang }}
          </th>
          <td>
            <input
              v-if="phrase"
              :style="{
                width: '100%',
                minWidth: `${phrase.lines[0].line.length}ex`
              }"
              type="text"
              v-model="phrase.lines[0].line"
              @change="nextTick(() => onSentenceChange(lang, phrase))"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
