<template>
  <div>
    <label for="input__file"
           class="bg-indigo text-white w-2/6 flex items-center justify-center hover:cursor-pointer px-12 py-3 mx-auto whitespace-nowrap">
      {{ label }}
    </label>
    <input @change="onChange" type="file" id="input__file" ref="fileRef" class="hidden" :accept="accept">
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  accept: String,
  label: String,
})

const emit = defineEmits(['select']);

const fileRef = ref('');

async function onChange(e) {
  const file = e.target.files[0];
  emit('select', file);
}

</script>
