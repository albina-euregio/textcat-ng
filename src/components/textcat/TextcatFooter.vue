<script setup lang="ts">
import { t } from "../../i18n";

const version = import.meta.env.VITE_GIT_VERSION;
</script>

<template>
  <footer>
    <hr />
    <ul class="inline">
      <li>
        <abbr :title="t('textcat-ng')">textcat-ng</abbr>
      </li>
      <li>
        {{ t("version") }}
        {{ version }}
      </li>
      <li>
        <a
          href="https://gitlab.com/albina-euregio/textcat-ng"
          target="_blank"
          rel="noopener noreferrer"
        >
          gitlab.com/albina-euregio/textcat-ng
        </a>
      </li>
      <li>
        <a
          href="https://gitlab.com/albina-euregio/textcat-ng/-/blob/master/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          GPL v3
        </a>
      </li>
      <slot />
    </ul>
  </footer>
</template>
