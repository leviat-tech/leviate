<template>
  <text
    font-family="Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace"
    class="cursor-default"
    text-anchor="middle"
    :font-size="fontSize"
    :x="x"
    :y="-y"
    :transform="transform === false ?  'scale(1, -1)' : transformText"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else>
      {{ props.label || defaultLabel }}
    </template>
  </text>
</template>
<script setup>
import useDraggablePoint from '../composables/useDraggablePoint';

const props = defineProps({
  x: Number,
  y: Number,
  label: String,
  transform: Boolean,
});

const { fontSize, transformText, label: defaultLabel } = useDraggablePoint();
</script>
