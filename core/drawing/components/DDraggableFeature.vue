<template>
  <g>
    <!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component -->
    <g
      v-if="html"
      ref="el"
      @click="onClick"
      v-bind="$attrs"
      v-html="html"
    />
  </g>
</template>

<script setup lang="ts">
import Big from 'big.js';
import { drag as d3Drag } from 'd3-drag';
import { selectAll } from 'd3-selection';
import { render, Sketch } from '@crhio/jsdraft';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import useDraggablePoint from '../composables/useDraggablePoint';
import { Feature, FeatureDefinition, Point, PointWithBulge, StyleProp } from '../types';
import { SHAPE_TYPES } from '../constants';
import { calculateCentroid } from '../utils';

const { currentPointWithPrecision, } = useDraggablePoint();

type Params = {
  location: Point;
  vertices: PointWithBulge[];
};

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  feature: FeatureDefinition,
  params: Feature,
  style: StyleProp,
  disabled?: boolean;
  isSelected?: boolean;
  isPreviewEnabled?: boolean;
}>();

const location = ref<Point>(props.params.location);
const diameter = ref<number>(props.params.diameter);
const vertices = ref<PointWithBulge[]>(props.params.vertices);
const isDragging = ref(false);

const draggableHandles = computed(() => {
  switch (props.params.shapeType) {
    case SHAPE_TYPES.POLYGONAL: {
      return null;
    }
    case SHAPE_TYPES.CIRCULAR: {
      const { x, y } = location.value;
      const r = diameter.value / 2;
      return {
        left: { x: x - r, y },
        right: { x: x + r, y },
        top: { x, y: y + r },
        bottom: { x, y: y - r },
      };
    }
  }
});


const html = computed(() => {
  const { feature, style } = props;
  const params = {
    ...props.params,
    location: location.value,
    vertices: vertices.value,
    diameter: diameter.value,
  };
  const sketch = feature.func(new Sketch(), params)?.style(style);
  return sketch ? render(sketch, 'svg', { viewport: null }) : null;
});

// Drag threshold in px to avoid drag event firing on click
const dragThreshold = 5;
let initialDiameter = diameter.value;

// The initial screen position in px, used to determine when dragging should start
let initialPosition: Point = { x: 0, y: 0 };

const emit = defineEmits(['click', 'drag-start', 'dragging', 'drag-end']);
const el = ref(null);
const selection = ref(null);

function getDragDistance() {
  const { x, y } = currentPointWithPrecision.value;
  return {
    x: Big(x).minus(initialPosition.x).toNumber(),
    y: Big(y).minus(initialPosition.y).toNumber(),
  };
}

function onClick() {
  emit('click', vertices.value);
}

function dragstart(e) {
  if (props.disabled) return;

  initialPosition = { x: e.sourceEvent.x, y: e.sourceEvent.y };

  emit('drag-start', { x: e.x, y: e.y });
}

function dragged(e: DragEvent) {
  if (!canDrag(e)) return;

  location.value = currentPointWithPrecision.value;
  isDragging.value = true;
  emit('dragging', { location: currentPointWithPrecision.value, vertices: vertices.value });
}

function dragend(e: DragEvent) {
  if (!canDrag(e)) return;

  isDragging.value = false;
  emit('drag-end', { location: currentPointWithPrecision.value, vertices: vertices.value });
}

function canDrag(e: DragEvent) {
  if (props.disabled) return false;

  const { x, y } = e.sourceEvent;

  const dx = x - initialPosition.x;
  const dy = y - initialPosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance >= dragThreshold;
}

watch(
  () => props.params.location,
  (newLocation) => {
    location.value = newLocation;
  }
);

// recalculating vertices to place pointer near the center of the opening
watch(
  () => props.params.vertices,
  (newVertices) => {
    if (props.isPreviewEnabled && newVertices?.length > 0) {
      const { x: pointX, y: pointY } = currentPointWithPrecision.value;
      const centroid = calculateCentroid(newVertices);
      vertices.value.forEach((vertice) => {
        vertice.x += pointX - centroid.x;
        vertice.y += pointY - centroid.y;
      });
    } else vertices.value = newVertices;
  },
  { immediate: true }
);

watch(
  () => currentPointWithPrecision.value,
  (val, prevVal) => {
    if ((!isDragging.value && !props.isPreviewEnabled) || !vertices.value?.length) return;
    const diff = { x: Big(val.x).minus(prevVal.x), y: Big(val.y).minus(prevVal.y) };
    vertices.value = vertices.value.map((vertex: Point) => ({
      x: diff.x.plus(vertex.x).toNumber(),
      y: diff.y.plus(vertex.y).toNumber(),
    }));
  },
  { deep: true }
);

onMounted(() => {
  selection.value = selectAll([el.value]);
  selection.value.call(d3Drag().on('start', dragstart).on('drag', dragged).on('end', dragend));
});

onBeforeUnmount(() => {
  selection.value?.on('.drag', null);
});
</script>
