<template>
  <div v-if="store.panels['input'].isExpanded" class="w-full h-full">
    <slot />
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useLeviateStore } from '../../../store/leviate';

  const store = useLeviateStore();
</script>

