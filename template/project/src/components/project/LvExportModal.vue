<template>
  <CModal :show="modelValue" title="Export" @close="$emit('update:modelValue', false)" size="lg">
    Document types and export settings go here
  </CModal>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean
});
</script>
