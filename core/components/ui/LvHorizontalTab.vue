<template>
  <div 
    class="relative text-center flex-grow h-full flex justify-center cursor-pointer px-1 items-center text-xs font-semibold" 
    @click="$emit('clicked')">
    <div>{{ name }}</div>
    <div class="absolute bottom-0 w-full h-1 bg-brand-500 transition-opacity duration-500 ease-in-out" :class="{ 'opacity-100' : active, 'opacity-0' : !active }"></div>
  </div>
</template>

<script setup>

const props = defineProps({
  name: {
    type: String,
    default: 'Tab',
  },
  active: {
    type: Boolean,
    default: false,
  }
})

</script>