<template>
  <circle
    ref="pointRef"
    class="cursor-move stroke-transparent stroke-[10px] draggable-point"
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
import AvailableColors from '@crhio/concrete/src/types/FormElementProps';

import useDrawing from '../composables/useDrawing';
import removeVertex from '../operations/removeVertex';
import { Point, PointWithBulge } from '../types/Drawings';
import useDrag from '../composables/useDrag';

const { state, config } = useDrawing();

const props = withDefaults(
  defineProps<{
    radius?: number;
    disabled?: boolean;
    point?: Point | null;
    color?: 'default' | 'selected' | 'danger';
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
let initialPosition: Point | null = null;

const emit = defineEmits(['update:modelValue', 'drag-start', 'dragging', 'drag-end']);
const pointRef = ref(null);
const scale = computed(() => state.pxToSvg);

const styleClass = computed(() => {
  if (props.disabled) {
    return 'cursor-auto';
  }

  const colors = {
    default: 'fill-black/60 hover:stroke-black/20 hover:fill-gray-900',
    selected: 'fill-[#005de3] hover:stroke-[#005de3]/20 hover:fill-[#005de3]',
    danger: 'fill-status-danger/60 hover:stroke-status-danger/20 hover:fill-status-danger',
  };

  if (props.isDeleteActive) return colors.danger;

  return colors[props.color] || colors.default;
});

function onClick() {
  if (!props.isDeleteActive) return;

  const newVertices = removeVertex(props.modelValue, props.point);
  emit('update:modelValue', newVertices);
}

useDrag(pointRef, {
  start: (e: DragEvent) => emit('drag-start', { x: e.x, y: e.y }),
  drag: (e: DragEvent) => emit('dragging', { x: e.x, y: e.y }),
  end: (e: DragEvent) =>  emit('drag-end', { x: e.x, y: e.y })
});
</script>
