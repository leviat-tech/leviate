<!-- ErrorBoundary.vue -->
<template>
  <div v-if="hasError">
    <div class="m-4 p-4 bg-danger-100 border border-danger-400 text-danger-700 rounded">
      <h2 class="text-lg font-bold mb-2">Error displaying drawing</h2>
      <p class="mb-4">We've caught an error in a child component.</p>
      <div class="bg-white p-2 rounded">
        <div class="cursor-pointer mb-2">Error Details:</div>
        <div v-for="detail in errorDetails" class="text-sm" v-html="detail"/>
      </div>
    </div>
  </div>
  <slot v-else></slot>
</template>

<script setup>
import { onErrorCaptured, ref, watch } from 'vue';

const props = defineProps({
  instance: Object,
});

const hasError = ref(false);
const errorDetails = ref([]);


onErrorCaptured((err, vm, info) => {
  hasError.value = true;

  if (errorDetails.value.length === 0) {
    errorDetails.value = [
      `<b>Component</b>: ${vm.$options.__name || 'Anonymous Component'}`,
      `<b>Info</b>: ${err.message}`
    ];
    }
    console.error("Error Boundary Caught:", err, vm, info);

  return false;
});

watch(() => props.instance, () => {
  hasError.value = false;
  errorDetails.value = [];
});
</script>
