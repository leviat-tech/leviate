<style>
html,
body {
  height: 100%;
  margin: 0;
}

  #app {
    height: 100%;
  }

  .Toastify--animate {
    animation-duration: .25s !important;
  }
</style>

<template>
  <div class="absolute inset-0 overflow-y-auto">
    <RouterView :key="appKey"/>
  </div>
  <LvModalAppInfo />
</template>

<script setup>
import { useLocalize } from '../plugins/localize';
import LvModalAppInfo from './LvModalAppInfo.vue';
import { useDesignCopyPaste } from '../composables/useDesignCopyPaste';

const appKey = useLocalize().locale;

useDesignCopyPaste();
</script>
