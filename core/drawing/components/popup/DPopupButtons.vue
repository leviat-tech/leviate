<template>
  <div class="flex justify-end space-x-1 pt-2">
    <button :class="buttonClass" @click="$emit('cancel')">
      <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-danger-500 size-3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>
    <button :class="buttonClass" @click="$emit('confirm')">
      <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-success-600 size-3">
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineEmits(['confirm', 'cancel']);

const buttonClass = 'p-1 bg-white border border-gray-300 rounded';
</script>
