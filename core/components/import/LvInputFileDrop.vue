<template>
  <div
    @mouseenter="isMouseActive = true"
    @mouseleave="isMouseActive = false"
    :class="{ 'border-indigo bg-indigo bg-opacity-5' : active }"
    class="relative m-4 border-dashed border text-center justify-center rounded-sm p-6 border-gray-300 flex flex-col items-center gap-y-2 duration-150"
  >

    <!-- mask to prevent toggling drag state when a button is present -->
    <div v-if="!isMouseActive"
         @dragenter.prevent="active = true"
         @dragleave.prevent="active = false"
         @dragover.prevent
         @drop.prevent="onDrop"
         class="absolute inset-0"
    />

    <div>{{ label }}</div>

    <slot />
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  label: String,
})

const emit = defineEmits(['select']);

const active = ref(false);

const isMouseActive = ref(false);

function onDrop(e) {
  active.value = false;
  const file = e.dataTransfer.files[0];
  emit('select', file);
}

</script>
