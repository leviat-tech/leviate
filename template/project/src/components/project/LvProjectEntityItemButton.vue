<template>
  <button class="hover:text-indigo" :title="title">
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
