<template>
  <div class="relative z-10 bg-gray-50 h-12 border-b flex items-center justify-end pr-1">
    <CButton @click="$emit('importShapes')" color="sky" :disabled="!selectedShapes?.length">
      <div>Import</div>
      <div class="w-6">{{ selectedCount }}</div>
    </CButton>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import useShapeSelect from '../../composables/useShapeSelect';

const { selectedShapes } = useShapeSelect();


const selectedCount = computed(() => {
  const selectedCount = selectedShapes.value?.length;

  return selectedCount ? `(${selectedCount})` : '';
});
</script>
