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

<template >
  <RouterView :key="appKey" />
</template>

<script setup>
import { useLocalize } from '../plugins/localize';

const appKey = useLocalize().locale;
</script>
