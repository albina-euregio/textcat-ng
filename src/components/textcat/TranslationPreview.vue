<script setup lang="ts">
import { LANGUAGE_VARIANTS } from "../../model";
import { translations } from "../state";
</script>

<template>
  <section>
    <table>
      <tbody>
        <tr v-for="lang in LANGUAGE_VARIANTS" :key="lang">
          <th class="pr-10">{{ lang }}</th>
          <td>{{ translations[lang] }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
