<template>
  <button
    class="border rounded hover:bg-gray-200"
    :class="isActive ?'border-gray-400 bg-gray-100' : 'border-transparent'"
  >
    <component :is="icon" width="28" height="28"/>
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

const props = defineProps<{
  icon: Component;
  isActive: boolean;
}>()
</script>
