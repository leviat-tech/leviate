<template>
  <address class="not-italic">
    <template v-for="field in fields">
      <span :class="boldFields.includes(field) && 'font-bold'">{{ data[field] }}</span><br>
    </template>
  </address>
</template>

<script setup>
const props = defineProps({
  data: Object,
  fields: Array,
  boldFields: { type: Array, default: [] },
});
</script>
