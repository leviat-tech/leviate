<template>
  <div
    @dragenter.prevent="active = true"
    :class="{ 'border-indigo bg-indigo bg-opacity-5' : active }"
    class="relative m-4 border-dashed border text-center justify-center rounded-sm p-4 border-gray-300 flex flex-col items-center gap-y-2 duration-150"
  >
    <div v-if="true"
         @dragleave.prevent="active = false"
         @dragover.prevent
         @drop.prevent="onDrop"
         class="absolute inset-0" />
    <slot />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['select']);

const active = ref(false);

function onDrop(e) {
  active.value = false;
  const file = e.dataTransfer.files[0];
  emit('select', file);
  console.log(file);
}

</script>
