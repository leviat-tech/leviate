<style>
html,
body {
  height: 100%;
  margin: 0;
}

  #app {
    height: 100%;
  }
</style>

<template>
  <div class="absolute inset-0 overflow-y-scroll">
    <RouterView :key="appKey"/>
  </div>

  <LvModalAppInfo />
</template>

<script setup>
import { useLocalize } from '../plugins/localize';
import LvModalAppInfo from './LvModalAppInfo.vue';

const appKey = useLocalize().locale;
</script>
