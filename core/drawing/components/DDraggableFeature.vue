<template>
  <!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component -->
  <g
    v-if="html"
    ref="el"
    @click="onClick"
    v-html="html"
  />
</template>

<script setup lang="ts">
import Big from 'big.js';
import { drag as d3Drag } from 'd3-drag';
import { selectAll } from 'd3-selection';
import { Sketch, render } from '@crhio/jsdraft';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import useDraggablePoint from '../composables/useDraggablePoint';
import { calculateCentroid } from '../utils';
import { Feature, FeatureDefinition, Point, PointWithBulge, StyleProp } from '../types';

const { currentPointWithPrecision } = useDraggablePoint();

type Params = {
  location: Point;
  vertices: PointWithBulge[];
};

const props = defineProps<{
  feature: FeatureDefinition,
  params: Feature,
  style: StyleProp,
  disabled?: boolean;
  isSelected?: boolean;
  isPreviewEnabled?: boolean;
}>();

const location = ref<Point>(props.params.location);
const vertices = ref<PointWithBulge[]>(props.params.vertices);
const isDragging = ref(false);

const html = computed(() => {
  const { feature, style } = props;
  const params = { ...props.params, location: location.value, vertices: vertices.value };
  const sketch = feature.func(new Sketch(), params)?.style(style);
  return sketch ? render(sketch, 'svg', { viewport: null }) : null;
});

// Drag threshold in px to avoid drag event firing on click
const dragThreshold = 5;
let initialPosition: Point | null = null;

const emit = defineEmits(['click', 'drag-start', 'dragging', 'drag-end']);
const el = ref(null);
const selection = ref(null);

function onClick() {
  emit('click', vertices.value);
}

function dragstart(e) {
  if (props.disabled) return;

  initialPosition = { x: e.sourceEvent.x, y: e.sourceEvent.y };

  emit('drag-start', { x: e.x, y: e.y });
}

function dragged(e) {
  if (!canDrag(e)) return;

  location.value = currentPointWithPrecision.value;
  isDragging.value = true;
  emit('dragging', { location: currentPointWithPrecision.value, vertices: vertices.value });
}

function dragend(e) {
  if (!canDrag(e)) return;

  isDragging.value = false;
  emit('drag-end', { location: currentPointWithPrecision.value, vertices: vertices.value });
}

function canDrag(e) {
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

//recalculating vertices to place pointer near the center of the opening
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
