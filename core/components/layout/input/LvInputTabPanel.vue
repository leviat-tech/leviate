<template>
  <div v-if="store.activeInputTab === tabId">
    <slot />
  </div>
</template>

<script setup>
import { useLeviateStore } from '@crhio/leviate/store/leviate.js';

const props = defineProps({
  tabId: String,
});

const store = useLeviateStore();
</script>
