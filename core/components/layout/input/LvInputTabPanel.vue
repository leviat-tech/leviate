<template>
  <div v-if="store.panels[panel].activeTab === tabId">
    <slot />
  </div>
</template>

<script setup>
import { useLeviateStore } from '@crhio/leviate/store/leviate.ts';

const props = defineProps({
  tabId: String,
  panel: {
    type: String,
    default: 'input'
  }
});

const store = useLeviateStore();
</script>
