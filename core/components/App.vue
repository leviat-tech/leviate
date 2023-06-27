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
import { useHost } from '../plugins/host.js';

const appKey = useHost().locale;
</script>
