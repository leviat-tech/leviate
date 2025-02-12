<template>
  <div
    v-if="store.panels.input.isExpanded"
    class="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-base-100 [&::-webkit-scrollbar-thumb]:bg-base-400"
  >
    <slot />
  </div>
</template>

<script setup>
import { useLeviateStore } from '../../../store/leviate';

const store = useLeviateStore();
</script>
