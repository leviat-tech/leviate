<template>
  <button class="hover:opacity-50" :title="title">
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
