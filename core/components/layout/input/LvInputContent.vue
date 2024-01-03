<template>
  <div
    v-if="store.panels.input.isExpanded"
    class="w-full h-full overflow-y-auto"
  >
    <slot />
  </div>
</template>

<script setup>
import { useLeviateStore } from '../../../store/leviate';

const store = useLeviateStore();
</script>
