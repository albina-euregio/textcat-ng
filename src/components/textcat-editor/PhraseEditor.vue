<script setup lang="ts">
import { computed, nextTick } from "vue";
import { t } from "../../i18n";
import {
  Lang,
  Phrase,
  REMOVE_ME_HEADER,
  SECOND_ITEM_PART_NO_SUFFIX,
  arrayMove,
  isSentence,
  newPhraseLine
} from "../../model";
import CaretDownSquare from "../bootstrap-icons/caret-down-square.vue";
import CaretUpSquare from "../bootstrap-icons/caret-up-square.vue";
import InputCursorText from "../bootstrap-icons/input-cursor-text.vue";
import PlusSquare from "../bootstrap-icons/plus-square.vue";
import TerminalSplit from "../bootstrap-icons/terminal-split.vue";
import XSquare from "../bootstrap-icons/x-square.vue";
import { catalog, catalogs } from "../state";
import {
  headerOrCurlyName,
  phraseCurlyName,
  sentenceCurlyName
} from "./editor-state";

const phraseLangs = computed(() =>
  Object.values(catalogs.value!.catalogs).map(c => ({
    lang: c.lang,
    phrase: c.phrase(phraseCurlyName.value),
    phraseNO: c.phrase(phraseCurlyName.value + SECOND_ITEM_PART_NO_SUFFIX)
  }))
);
const usages = computed(() =>
  [
    ...catalogs.value!.catalogs.de.sentences,
    ...catalogs.value!.catalogs.de.phrases
  ].filter(phrase =>
    phrase.lines.some(l =>
      l.lineFragments?.some(f => f === "{" + phraseCurlyName.value + "}")
    )
  )
);

async function onPhraseChange(lang: Lang, phrase: Phrase) {
  catalogs.value = await catalogs.value!.changePhrase(lang, phrase);
}

function removePhrase() {
  const message = t("editor.phrase.remove", phraseCurlyName);
  const ok = confirm(message);
  if (!ok) return;
  phraseLangs.value.forEach(({ lang, phrase }) => {
    if (!phrase) return;
    phrase.header = REMOVE_ME_HEADER;
    onPhraseChange(lang, phrase);
  });
}

function addPhrase() {
  const curlyName = prompt("curlyName");
  if (!curlyName) return;
  phraseLangs.value.forEach(({ lang }) =>
    onPhraseChange(lang, {
      $type: "Phrase",
      header: curlyName,
      curlyName,
      lines: []
    })
  );
}

function renamePhrase() {
  const curlyName = prompt("curlyName", phraseCurlyName.value);
  if (!curlyName || curlyName === phraseCurlyName.value) return;
  phraseLangs.value.forEach(({ lang, phrase }) => {
    if (!phrase) return;
    const header = phrase.header;
    // removePhrase
    phrase.header = REMOVE_ME_HEADER;
    onPhraseChange(lang, phrase);
    // addPhrase
    phrase.header = header;
    phrase.curlyName = curlyName;
    onPhraseChange(lang, phrase);
  });
  phraseCurlyName.value = curlyName;
}

function addPhraseLine() {
  const lines = prompt("lines (separated by semicolon)");
  if (!lines) return;
  phraseLangs.value.forEach(({ lang, phrase, phraseNO }) => {
    if (!phrase) return;
    lines.split(";").forEach(line => {
      phrase.lines.push(newPhraseLine(line.trim()));
      phraseNO?.lines.push(newPhraseLine(line.trim()));
    });
    onPhraseChange(lang, phrase);
  });
}

function movePhraseLine(fromIndex: number, toIndex?: number) {
  if (toIndex === undefined) {
    const message = t("editor.phrase-line.remove", fromIndex + 1);
    if (!confirm(message)) return;
  }
  phraseLangs.value.forEach(({ phrase, phraseNO, lang }) => {
    if (phrase) {
      phrase.lines = arrayMove(phrase.lines, fromIndex, toIndex);
      onPhraseChange(lang, phrase);
    }
    if (phraseNO) {
      phraseNO.lines = arrayMove(phraseNO.lines, fromIndex, toIndex);
      onPhraseChange(lang, phraseNO);
    }
  });
}

function togglePhraseNO(
  lang: Lang,
  phrase: Phrase,
  phraseNO: Phrase | undefined
) {
  const curlyName = phrase.curlyName + SECOND_ITEM_PART_NO_SUFFIX;
  const message = hasPhraseLines(phraseNO)
    ? t("editor.phrase.remove", `${curlyName} (${lang})`)
    : t("editor.phrase.add", `${curlyName} (${lang})`);
  if (!confirm(message)) return;
  onPhraseChange(lang, {
    $type: "Phrase",
    header: phrase.header,
    curlyName,
    lines: hasPhraseLines(phraseNO)
      ? []
      : phrase.lines.map(l => newPhraseLine(l.line, l.region))
  });
}

function hasPhraseLines(phrase: Phrase | undefined): phrase is Phrase {
  return (phrase?.lines.length ?? 0) > 0;
}

let array: Phrase[];
</script>

<template>
  <div class="block" style="max-height: 30vh; overflow-y: scroll">
    <h2>
      {{ t("editor.phrase") }}{{ " " }}
      <small>
        <button @click="addPhrase()" :title="t('editor.phrase.add', '')">
          <PlusSquare />
        </button>
        <button
          @click="renamePhrase()"
          :disabled="!phraseCurlyName"
          :title="t('editor.phrase.rename', phraseCurlyName || '')"
        >
          <InputCursorText />
        </button>
        <button
          @click="removePhrase()"
          :disabled="!phraseCurlyName"
          :title="t('editor.phrase.remove', phraseCurlyName || '')"
        >
          <XSquare />
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
      <select class="f-auto f-truncate" v-model="phraseCurlyName">
        <option value=""></option>
        <option
          v-for="phrase in catalog!.phrases"
          :key="phrase.curlyName"
          :value="phrase.curlyName"
        >
          {{ phrase[headerOrCurlyName] }}
        </option>
      </select>
    </label>

    <label v-if="usages.length > 0" class="d-flex">
      <span class="pr-10">{{ t("editor.used-in") }}:</span>
      <ul class="inline">
        <li
          v-for="p in usages"
          :key="p.curlyName"
          @click="
            () =>
              isSentence(p)
                ? (sentenceCurlyName = p.curlyName)
                : (phraseCurlyName = p.curlyName)
          "
          style='{ cursor: "pointer" }'
        >
          {{ p.curlyName }}
        </li>
      </ul>
    </label>

    <table style='{ width: "100%" }'>
      <tbody>
        <tr>
          <td></td>
          <td v-for="{ lang, phrase } in phraseLangs" :key="lang">
            <input
              v-if="phrase"
              :lang="lang"
              :spellcheck="true"
              :style="{
                width: '100%',
                minWidth: `${phrase[headerOrCurlyName].length}ex`
              }"
              type="text"
              v-model="phrase[headerOrCurlyName]"
              @change="nextTick(() => onPhraseChange(lang, phrase))"
            />
          </td>
        </tr>

        <tr>
          <th>№</th>
          <th v-for="{ lang, phrase, phraseNO } in phraseLangs" :key="lang">
            {{ lang }}{{ " " }}
            <small>
              <button
                @click="addPhraseLine()"
                :title="t('editor.phrase-line.add')"
              >
                <PlusSquare />
              </button>
              <button
                v-if="phrase"
                @click="togglePhraseNO(lang, phrase, phraseNO)"
                :title="t('editor.phrase.toggle-split')"
              >
                <TerminalSplit />
              </button>
            </small>
          </th>
        </tr>

        <tr v-for="(_, index) in phraseLangs[0].phrase?.lines" :key="index">
          <td :style="{ whiteSpace: 'nowrap' }">
            {{ index + 1 }}{{ " " }}
            <small>
              <button
                :disabled="index === 0"
                @click="movePhraseLine(index, index - 1)"
                :title="t('editor.phrase-line.moveUp')"
              >
                <CaretUpSquare />
              </button>
              <button
                @click="movePhraseLine(index, undefined)"
                :title="t('editor.phrase-line.remove', index + 1)"
              >
                <XSquare />
              </button>
              <button
                :disabled="
                  index >= (phraseLangs[0].phrase?.lines.length ?? 0) - 1
                "
                @click="movePhraseLine(index, index + 1)"
                :title="t('editor.phrase-line.moveDown')"
              >
                <CaretDownSquare />
              </button>
            </small>
          </td>
          <td v-for="{ lang, phrase, phraseNO } in phraseLangs" :key="lang">
            {{ void (array = [phrase!, phraseNO!].filter(hasPhraseLines)) }}
            <input
              v-for="(phrase0, i) in array"
              :key="i"
              :lang="lang"
              :spellcheck="true"
              :style="{
                width: `${100 / array.length}%`,
                minWidth: `${phrase0.lines[index].line.length}ex`
              }"
              type="text"
              v-model="phrase0!.lines[index].line"
              @change="nextTick(() => onPhraseChange(lang, phrase0))"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
