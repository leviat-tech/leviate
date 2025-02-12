<template>
  <button class="text-base-600 hover:text-base-800" :title="title">
    <CIcon :type="icon" size="sm"></CIcon>
  </button>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  }
});

</script>
