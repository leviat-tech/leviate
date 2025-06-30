<template>
  <path
    :d="generatedPath"
    stroke="red"
    stroke-width="1"
    fill="none"
    class="cross-line invisible group-hover:visible"
  />
</template>
<script setup>
import { computed } from 'vue';
import useDrawing from '../composables/useDrawing.ts';

const props = defineProps({
  vertex: Object,
  pointRadius: Number,
});
const { state } = useDrawing();
// CSvg2dViewport is the provider of the viewport
const scale = computed(() => state?.pxToSvg || 1);
const x = computed(() => props.vertex.x);
const y = computed(() => props.vertex.y);
const generatedPath = computed(() => {
  const length = props.pointRadius * 2 * scale.value;
  const path = `M${x.value - length} ${y.value - length} L${x.value + length} ${y.value + length} M${x.value - length} ${y.value + length} L${x.value + length} ${y.value - length}`;
  return path;
});
</script>
<style>
.cross-line {
  vector-effect: non-scaling-stroke;
}
</style>
