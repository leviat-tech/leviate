<template>
  <!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component -->
  <g
    v-if="html"
    ref="el"
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
import { FeatureDefinition, Point, StyleProp } from '../types';

const { currentPointWithPrecision } = useDraggablePoint();

const props = defineProps<{
  feature: FeatureDefinition,
  params: unknown,
  style: StyleProp,
  disabled?: boolean;
  isSelected?: boolean;
  isPreviewEnabled?: boolean;
}>();

const isDragging = ref(false);

// Drag threshold in px to avoid drag event firing on click
const dragThreshold = 5;
let initialPosition: Point;

const emit = defineEmits<{
  (e: 'drag-start'): void;
  (e: 'dragging', payload: Point): void;
  (e: 'drag-end', payload: Point): void;
}>();

const el = ref(null);
const selection = ref(null);
const localLocation = ref({ x: 0, y: 0 });

const html = computed(() => {
  const { feature, style } = props;
  const { x, y } = localLocation.value;
  const sketch = feature.func(new Sketch(), props.params)?.style(style).translate(x, y);
  return sketch ? render(sketch, 'svg', { viewport: null }) : null;
});

function getDragDistance() {
  const { x, y } = currentPointWithPrecision.value;
  return {
    x: Big(x).minus(initialPosition.x).toNumber(),
    y: Big(y).minus(initialPosition.y).toNumber(),
  };
}

function dragstart(e: Event) {
  if (props.disabled) return;

  initialPosition = currentPointWithPrecision.value;

  emit('drag-start');
}

function dragged(e) {
  if (!canDrag(e)) return;

  isDragging.value = true;

  const dragDistance = getDragDistance();

  localLocation.value = dragDistance;

  emit('dragging', dragDistance);
}

function dragend(e) {
  if (!canDrag(e)) return;

  isDragging.value = false;
  emit('drag-end', getDragDistance());
  localLocation.value = { x: 0, y: 0 };
}

function canDrag(e) {
  if (props.disabled) return false;

  const { x, y } = e.sourceEvent;

  const dx = x - initialPosition.x;
  const dy = y - initialPosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance >= dragThreshold;
}

onMounted(() => {
  selection.value = selectAll([el.value]);
  selection.value.call(d3Drag().on('start', dragstart).on('drag', dragged).on('end', dragend));
});

onBeforeUnmount(() => {
  selection.value?.on('.drag', null);
});
</script>
