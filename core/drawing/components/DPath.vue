<template>
  <path :d="path" stroke-width="2" vector-effect="non-scaling-stroke" class="stroke-danger" />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  endPoint: Object,
  startPoint: Object,
});

const path = computed(() => {
  if (!props.startPoint) return '';

  const { startPoint, endPoint } = props;

  return `M ${startPoint.x}, ${startPoint.y} L ${endPoint.x},${endPoint.y}`;
});
</script>
