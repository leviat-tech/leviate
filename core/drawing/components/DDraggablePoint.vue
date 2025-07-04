<template>
  <!-- TODO solve problem with radius, static to make dragable point visibie but it should come form config which does not work right now-->
  <circle
    ref="pointRef"
    class="cursor-move stroke-transparent fill-black/60 stroke-[10px] concrete__draggable-point"
    style="vector-effect: non-scaling-stroke !important; paint-order: stroke fill markers"
    :class="styleClass"
    :cx="point.x"
    :cy="point.y"
    :r="(radius || config.vertexRadius) * scale"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { drag as d3Drag } from 'd3-drag';
import { selectAll } from 'd3-selection';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { AvailableColors } from '@crhio/concrete/src/types/FormElementProps';

import useDrawing from '../composables/useDrawing';
import removeVertex from '../operations/removeVertex';
import { Point, PointWithBulge } from '../../drawing/types/Drawings';

const { state, config } = useDrawing();

const props = withDefaults(
  defineProps<{
    radius?: number;
    disabled?: boolean;
    point?: Point | null;
    color?: AvailableColors;
    isDeleteActive?: boolean;
    modelValue?: PointWithBulge[];
  }>(),
  {
    color: 'default',
    disabled: false,
    isDeleteActive: false,
    point: () => ({ x: 0, y: 0 }),
  }
);

// Drag threshold in px to avoid drag event firing on click
const dragThreshold = 5;
let initialPosition = null;

const emit = defineEmits(['update:modelValue', 'drag-start', 'dragging', 'drag-end']);
const pointRef = ref(null);
const selection = ref(null);
const scale = computed(() => state.pxToSvg);
const styleClass = computed(() => {
  if (props.disabled) {
    return 'cursor-auto';
  }

  const colors = {
    default: 'hover:stroke-black/20 hover:fill-gray-900',
    indigo: 'hover:stroke-indigo/20 hover:fill-indigo',
    sky: 'hover:stroke-sky/20 hover:fill-sky',
    steel: 'hover:stroke-steel/20 hover:fill-steel',
    success: 'hover:stroke-success/20 hover:fill-success',
    warning: 'hover:stroke-warning/20 hover:fill-warning',
    danger: 'hover:stroke-danger/20 hover:fill-danger',
  };

  if (props.isDeleteActive) return colors.danger;

  return colors[props.color];
});

function onClick() {
  if (!props.isDeleteActive) return;

  const newVertices = removeVertex(props.modelValue, props.point);
  emit('update:modelValue', newVertices);
}

function dragstart(e) {
  if (props.disabled || props.isDeleteActive) return;

  initialPosition = { x: e.sourceEvent.x, y: e.sourceEvent.y };

  emit('drag-start', { x: e.x, y: e.y });
}

function dragged(e) {
  if (!canDrag(e)) return;

  emit('dragging', { x: e.x, y: e.y });
}

function dragend(e) {
  if (!canDrag(e)) return;

  emit('drag-end', { x: e.x, y: e.y });
}

function canDrag(e) {
  if (props.disabled || props.isDeleteActive) return false;

  const { x, y } = e.sourceEvent;

  const dx = x - initialPosition.x;
  const dy = y - initialPosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance >= dragThreshold;
}

onMounted(() => {
  selection.value = selectAll([pointRef.value]);
  selection.value.call(d3Drag().on('start', dragstart).on('drag', dragged).on('end', dragend));
});

onBeforeUnmount(() => {
  selection.value?.on('.drag', null);
});
</script>
