<template>
  <div class="my-6">
    <div v-if="isWarningVisible" class="flex p-2 bg-warning-lightest align-items">
      <CIcon type="warning" size="lg" class="mr-4 text-danger"></CIcon>
      {{ $l('uncalculated_columns_detected') }}
    </div>
  </div>

  <div class="text-sm mb-2 font-semibold">{{ $L(label) }}</div>

  <slot />
</template>

<script setup lang="ts">
  defineProps({
    label: {
      type: String,
      default: 'position_selection',
    },
    isWarningVisible: {
      type: Boolean,
      default: false,
    },
  });
</script>
