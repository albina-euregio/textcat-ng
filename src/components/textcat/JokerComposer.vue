<script setup lang="ts">
import {
  DEEPL_LANGUAGES,
  isJoker,
  isTranslateJokerEnabled,
  Joker,
  LANGUAGES,
  translateJoker,
  withJokerText
} from "../../model";

const writtenPhrase = defineModel<Joker>({ required: true });

if (!isJoker(writtenPhrase.value)) throw new Error();
</script>

<template>
  <table class="joker">
    <tbody>
      <tr v-for="lang in LANGUAGES" :key="lang">
        <th>{{ lang }}</th>
        <td>
          <input
            type="text"
            :lang="lang"
            :spellcheck="true"
            :value="writtenPhrase.args[lang]"
            @change="
              event => {
                writtenPhrase = withJokerText(
                  writtenPhrase,
                  lang,
                  (event.target as HTMLInputElement).value
                );
              }
            "
          />
        </td>
        <td>
          <button
            v-if="isTranslateJokerEnabled() && DEEPL_LANGUAGES.includes(lang)"
            :disabled="!writtenPhrase.args[lang]"
            @click="
              async () => {
                writtenPhrase = await translateJoker(writtenPhrase, lang);
              }
            "
          >
            DeepL
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
