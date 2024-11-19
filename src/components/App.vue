<script setup lang="ts">
import { get, set } from "idb-keyval";
import { watchEffect } from "vue";
import { t } from "../i18n";
import { buildAllTextcat } from "../model";
import ArrowClockwise from "./bootstrap-icons/arrow-clockwise.vue";
import CheckSquare from "./bootstrap-icons/check-square.vue";
import Clipboard from "./bootstrap-icons/clipboard.vue";
import Copy from "./bootstrap-icons/copy.vue";
import FolderOpen from "./bootstrap-icons/folder2-open.vue";
import {
  catalog,
  catalogs,
  copyToClipboard,
  dirHandle,
  isClipboardEnabled,
  pasteSentenceFromClipboard,
  showTranslation,
  textcatEditor,
  translations,
  writtenText
} from "./state";
import TextcatEditor from "./textcat-editor/TextcatEditor.vue";
import LanguageSelect from "./textcat/LanguageSelect.vue";
import { usePmData } from "./textcat/pmData";
import RegionSelect from "./textcat/RegionSelect.vue";
import TextcatFooter from "./textcat/TextcatFooter.vue";
import TextComposer from "./textcat/TextComposer.vue";
import TranslationCheckbox from "./textcat/TranslationCheckbox.vue";
import TranslationPreview from "./textcat/TranslationPreview.vue";

function reloadTextcat() {
  if (!textcatEditor) {
    buildAllTextcat(undefined).then(cs => (catalogs.value = cs));
  } else if (dirHandle) {
    buildAllTextcat(dirHandle.value).then(cs => (catalogs.value = cs));
  }
}

watchEffect(() => {
  get<FileSystemDirectoryHandle | undefined>("dirHandle").then(
    h => (dirHandle.value = h)
  );
});

watchEffect(() => {
  reloadTextcat();
});

async function openEditor() {
  dirHandle.value = await window.showDirectoryPicker();
  set("dirHandle", dirHandle.value);
}

const { postPmData } = usePmData();
</script>

<template>
  <section>
    <button v-if="textcatEditor" @click="openEditor()">
      <FolderOpen /> {{ t("editor.open") }}
    </button>
    <button v-if="textcatEditor" @click="reloadTextcat()">
      <ArrowClockwise /> {{ t("editor.reload") }}
    </button>

    <h1 class="d-none">textcat-ng</h1>

    <TextcatEditor v-if="textcatEditor && catalog && catalogs" />

    <TextComposer />

    <template v-if="showTranslation">
      <h2>{{ t("heading.translations") }}</h2>
      <TranslationPreview />
    </template>

    <button
      class="mt-10"
      type="submit"
      @click="postPmData(writtenText, translations)"
    >
      <CheckSquare /> {{ t("translations.submit") }}
    </button>
    <button
      :disabled="!isClipboardEnabled"
      @click="copyToClipboard(writtenText)"
      :title="t('sentences.copy')"
    >
      <Copy />
    </button>
    <button
      :disabled="!isClipboardEnabled"
      @click="pasteSentenceFromClipboard(-1)"
      :title="t('sentences.paste')"
    >
      <Clipboard />
    </button>

    <TextcatFooter>
      <li v-if="catalog?.lastModified">
        satzkatalog {{ catalog.lastModified }}
      </li>
      <li><LanguageSelect /></li>
      <li><RegionSelect /></li>
      <li><TranslationCheckbox /></li>
    </TextcatFooter>
  </section>
</template>
