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

const props = defineProps({
  label: String,
  accept: { type: String, required: true },
});

const emit = defineEmits(['select', 'error']);

const active = ref(false);

const isMouseActive = ref(false);
const acceptedExtensions = props.accept.replace(/\./g, '').split(',');

function onDrop(e) {
  active.value = false;
  const file = e.dataTransfer.files[0];

  const extension = file.name.split('.').pop();
  const isAccepted = acceptedExtensions.includes(extension);

  if (isAccepted) {
    emit('select', file);
  } else {
    emit('error', 'import_error_unsupported_file_type');
  }

}

</script>
