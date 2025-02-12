<template>
  <LvPanel :expanded="width" panelId="input">
    <div class="h-full flex flex-col justify-start">
      <LvInputToolbar :tabs="tabs" />
      <slot />
    </div>
  </LvPanel>
</template>

<script setup>
import LvPanel from '../ui/LvPanel.vue';
import LvInputToolbar from './input/LvInputToolbar.vue';
import { useLeviateStore } from '@crhio/leviate/store/leviate.js';

const store = useLeviateStore();

const props = defineProps({
  width: {
    type: Number,
    default: 440,
  },
  tabs: {
    type: Array,
    default: ['input'],
  }
});
</script>

