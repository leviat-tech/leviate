<template>
  <button
    class="border border-transparent rounded hover:bg-gray-200"
    :class="isActive && 'border-gray-400 bg-gray-100'"
  >
    <component :is="icon" width="28" height="28"/>
  </button>
</template>

<script setup lang="ts">
import { DefineComponent } from 'vue';

const props = defineProps<{
  icon: DefineComponent;
  isActive: boolean;
}>()
</script>
