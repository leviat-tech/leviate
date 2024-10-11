<template>
  <div class="my-6">
    <div v-if="warningMessage?.length" class="flex p-2 bg-warning-lightest align-items">
      <CIcon type="warning" size="lg" class="mr-4 text-danger"></CIcon>
      {{ $l(warningMessage) }}
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
    warningMessage: String
  });
</script>
