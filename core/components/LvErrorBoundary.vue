<!-- ErrorBoundary.vue -->
<template>
  <div v-if="hasError">
    <div class="p-4 bg-danger-100 border border-danger-400 text-danger-700 rounded">
      <h2 class="text-lg font-bold mb-2">Error displaying drawing</h2>
      <p class="mb-4">We've caught an error in a child component.</p>
      <div class="bg-white p-2 rounded">
        <div class="cursor-pointer">Error Details:</div>
        <pre class="mt-2 text-sm whitespace-pre-wrap break-all"><code>{{ errorInfo }}</code></pre>
      </div>
    </div>
  </div>
  <slot v-else></slot>
</template>

<script setup>
import { ref, onErrorCaptured, watch } from 'vue';

const props = defineProps({
  instance: Object,
});

// Reactive state to track if an error has occurred
const hasError = ref(false);
// Reactive state to store error information
const errorInfo = ref(null);

onErrorCaptured((err, vm, info) => {
  hasError.value = true;
  errorInfo.value = {
    component: vm.$options.__name || 'Anonymous Component',
    info: info,
  };
  console.error("Error Boundary Caught:", err, vm, info);

  // Return false to prevent the error from propagating further up
  // the component tree.
  return false;
});

watch(() => props.instance, () => {
  hasError.value = false;
  errorInfo.value = null;
});
</script>
