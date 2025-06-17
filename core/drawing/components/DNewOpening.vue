<template class="viewport__new_geometry">
  <g>
    <circle
      v-if="opening.type === FEATURE_TYPES.circular"
      :r="radius"
      :cx="opening.location.x"
      :cy="opening.location.y"
      :fill="style.fill"
      :opacity="style.opacity"
    />
    <template v-if="opening.type === FEATURE_TYPES.polygonal">
      <path :d="path" stroke-width="2" vector-effect="non-scaling-stroke" class="stroke-danger" />
      <polygon :points="points" :opacity="style.opacity" :style="`fill: ${style.fill}`" />
    </template>
    <!-- TODO: remove text's conditional once rectangular added -->
    <text
      v-if="opening.type !== FEATURE_TYPES.rectangular"
      text-anchor="middle"
      :x="opening.location.x"
      :y="-opening.location.y"
      :font-size="fontSize"
      :transform="transformText"
    >
      {{ label }}
    </text>
  </g>
</template>

<script setup>
/* eslint-disable */
import { computed } from 'vue';
import useDraggablePoint from '../composables/useDraggablePoint';
import { FEATURE_TYPES } from '../constants';

const props = defineProps({
  opening: Object,
  style: {
    type: Object,
    default() {
      return {
        fill: 'red',
        opacity: '0.45',
      };
    },
  },
});

const { label, fontSize, transformText } = useDraggablePoint();

const radius = computed(() => props.opening.diameter * 0.5);
const points = computed(() => props.opening.vertices.flatMap(obj => [obj.x, obj.y]).join(','));
const path = computed(() => {
  if (props.opening.vertices.length !== 2) return '';
  const [{ x: startX, y: startY }, { x: endX, y: endY }] = props.opening.vertices;

  return `M ${startX}, ${startY} L ${endX},${endY}`;
});
</script>
