<template>
  <LvPanel :expanded="width" panelId="input">
    <div class="h-full flex flex-col justify-start">
      <LvInputToolbar :tabs="tabs" />
      <slot />
    </div>
  </LvPanel>
</template>

<script setup lang="ts">
import LvPanel from '../ui/LvPanel.vue';
import LvInputToolbar from './input/LvInputToolbar.vue';

type Tab = string | { name: string; disabled: boolean };

withDefaults(
  defineProps<{
    width?: number;
    tabs: Array<Tab>;
  }>(),
  {
    width: 440,
    tabs: () => ['input'],
  }
);
</script>
