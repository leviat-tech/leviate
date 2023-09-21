<template>
  <div class="text-center w-full h-full flex justify-center cursor-pointer px-1 py-1 items-center text-xs hover:bg-indigo-lightest" :class="styleClass">
    <slot />
  </div>        
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  }
})

const styleClass = computed(() => {
  return props.isActive ? 'bg-white' : 'bg-gray-100'
})
</script>

