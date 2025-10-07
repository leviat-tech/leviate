<template>
  <div>
    <label
      :for="id"
      class="bg-brand-500 text-white w-2/6 flex items-center justify-center hover:cursor-pointer px-12 py-3 mx-auto whitespace-nowrap"
    >
      {{ label }}
    </label>

    <input type="file" :id="id" ref="fileRef" class="hidden" :accept="accept" @change="onChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

withDefaults(
  defineProps<{
    id: string;
    label: string;
    accept: string;
  }>(),
  {
    id: '',
    label: '',
    accept: '',
  }
);

const emit = defineEmits(['select']);

const fileRef = ref('');

async function onChange(e) {
  const file = e.target.files[0];
  emit('select', file);
}
</script>
