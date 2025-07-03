<template class="viewport__new_geometry">
  <g v-if="state.isPointerActive">
    <slot :path="path">
      <path
        v-if="path"
        :d="`M ${path.startX}, ${path.startY} L ${path.endX},${path.endY}`"
        stroke-width="2"
        vector-effect="non-scaling-stroke"
        class="stroke-red-500"
      />
    </slot>

    <text
      text-anchor="middle"
      :x="pointToAdd.x"
      :y="-pointToAdd.y"
      :font-size="fontSize"
      :transform="transformText"
    >
      {{ label }}
    </text>

    <DDraggablePoint :point="pointToAdd" :radius="config.vertexRadius" />
  </g>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { isEqual } from 'lodash-es';
import useDraggablePoint from '../composables/useDraggablePoint';
import DDraggablePoint from './DDraggablePoint.vue';
import useDrawing from '../composables/useDrawing.ts';
import { addVertex } from '../operations';
import { setToCounterClockwise } from '../utils';
import useClosestPointOnSegment from '../composables/useClosestPointOnSegment';
import { PointWithBulge } from '@crhio/leviate/drawing/types/Drawings.js';

const props = withDefaults(
  defineProps<{
    modelValue?: PointWithBulge[];
    shouldMindEdges?: boolean;
  }>(),
  {
    shouldMindEdges: false,
  }
);

const emit = defineEmits(['update:modelValue', 'close-path']);

const { state, config, tools } = useDrawing();
const { label, fontSize, transformText, currentPointWithPrecision } = useDraggablePoint();
const { isCloseToEdge, pointToAddOnSegment } = useClosestPointOnSegment();

const pointToAdd = computed(() => {
  return props.shouldMindEdges && isCloseToEdge.value
    ? pointToAddOnSegment.value
    : currentPointWithPrecision.value;
});
const prevVertex = computed(() => props.modelValue[props.modelValue.length - 1]);

const path = computed(() => {
  if (!prevVertex.value) return '';
  const { x: startX, y: startY } = prevVertex.value;
  const { x: endX, y: endY } = pointToAdd.value;

  return { startX, startY, endX, endY };
});

function closePath() {
  if (props.modelValue.length > 2) {
    state.currentTool = tools.pointer;
    emit('close-path');
  }
}

function addVertexLocal() {
  if (!state.isPointerActive) return;

  const { x, y } = pointToAdd.value;
  const newVertex = { x: Number(x), y: Number(y), bulge: 0 };
  const newVertices = addVertex(props.modelValue, newVertex);

  const isFirstPoint = isEqual(newVertex, props.modelValue[0]);

  if (isFirstPoint) {
    closePath();
  } else {
    emit('update:modelValue', newVertices);
  }
}

watch(
  () => state.actionKeys.Escape,
  (esc) => {
    if (esc && props.modelValue.length > 2) {
      closePath();
    }
  }
);

watch(
  () => state.currentTool,
  (tool) => {
    if (tool !== tools.new_polygon && props.modelValue.length > 2) {
      setToCounterClockwise(props.modelValue);
      emit('update:modelValue', props.modelValue);
    }
  }
);

onMounted(() => {
  window.addEventListener('click', addVertexLocal);
  window.addEventListener('contextmenu', closePath);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', addVertexLocal);
  window.removeEventListener('contextmenu', closePath);
});
</script>
