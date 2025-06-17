<template>
  <g>
    <g>
      <path
        :d="generateGridlinesPath()"
        stroke="#ccc"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
      />
      <path
        :d="generateGridlinesPath(10)"
        stroke="#aaa"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
      />
    </g>
  </g>
</template>

<script setup>
import { computed, watch } from 'vue';
import useDrawing from '../composables/useDrawing.ts';

const props = defineProps({
  dragOffset: Object,
  pxToSvg: Number,
  viewBox: Object,
});

const { state } = useDrawing();

function dynamicRound(num) {
  const magnitude = Math.floor(Math.log10(Math.abs(num)));
  return 10 ** (magnitude + 2);
}

const gridSpacing = computed(() => {
  return dynamicRound(state.pxToSvg / 2);
});

function round(number, roundTo) {
  const factor = 1 / roundTo;
  return Math.round(number * factor) / factor;
}

function generateGridlinesPath(multiplier = 1) {
  const adjustedSpacing = gridSpacing.value * multiplier;
  const { x: offsetX, y: offsetY } = props.dragOffset;
  const { width, height } = props.viewBox;
  const minY = props.viewBox.minY - offsetY;
  const minX = props.viewBox.minX - offsetX;
  const startX = round(minX, adjustedSpacing);
  const startY = round(minY, adjustedSpacing);
  const maxX = startX + width;
  const maxY = height + startY;

  let path = '';

  // Vertical lines
  for (let x = startX; x <= maxX; x += adjustedSpacing) {
    path += `M ${x} ${minY} L ${x} ${height + minY}`;
  }

  // Horizontal lines
  for (let y = startY; y <= maxY; y += adjustedSpacing) {
    path += ` M ${minX} ${y} L ${width + minX} ${y}`;
  }

  return path;
}

watch(gridSpacing, val => {
  state.gridPrecision = val.toString().split('.')[1]?.length || 0;
});
</script>
