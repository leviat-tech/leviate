<template>
  <text
    font-family="Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace"
    class="cursor-default"
    text-anchor="middle"
    :font-size="fontSize"
    :x="x"
    :y="-y"
    :transform="transformText"
  >
    {{ props.label || defaultLabel }}
  </text>
</template>
<script setup>
import useDraggablePoint from '../composables/useDraggablePoint';

const props = defineProps({
  x: Number,
  y: Number,
  label: String,
});

const { fontSize, transformText, label: defaultLabel } = useDraggablePoint();
</script>
