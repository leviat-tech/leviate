<template>
  <LvPanel :expanded="440" panelId="input">
    <div class="h-full flex flex-col justify-start -mx-px">
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
  tabs: {
    type: Array,
    default: ['input'],
  }
});
</script>

