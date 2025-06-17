<template>
  <template v-if="selectedSegment && pointToAdd">
    <DHoverText :x="pointToAdd.x" :y="pointToAdd.y" :label="label" />
    <DDraggablePoint
      :point="pointToAdd"
      :radius="radius || config.vertexRadius"
      @click="addNewVertex"
    />
  </template>
</template>
<script setup>
import Big from 'big.js';
import { computed, ref, watchEffect } from 'vue';

import {
  getNearestPointOnSegment,
  getSegmentsFromVertexList,
  ptDistSq,
  getNearestPointOnArc,
} from '../utils';
import { addVertexToSegment } from '../operations';
import useDrawing from '../composables/useDrawing.ts';
import useDraggablePoint from '../composables/useDraggablePoint';
import DDraggablePoint from './DDraggablePoint.vue';
import DHoverText from './DHoverText.vue';

const props = defineProps({
  radius: Number,
  // List of segments
  modelValue: Array,
  proximityDistance: Number,
  updateVertex: Function,
  addVertex: Function,
});

const emit = defineEmits(['update:modelValue']);

const { state, config } = useDrawing();
const { currentPointWithPrecision, precision } = useDraggablePoint();

const scaledProximityDistance = computed(() => props.proximityDistance * state.pxToSvg);

const pointToAdd = ref(null);

const label = computed(() => {
  const { unitScaleFactor } = config;

  return [
    Big(pointToAdd.value.x).times(unitScaleFactor).toNumber(),
    Big(pointToAdd.value.y).times(unitScaleFactor).toNumber(),
  ].join(', ');
});

const segments = computed(() => getSegmentsFromVertexList(props.modelValue));
const selectedSegment = ref(null);

watchEffect(() => {
  selectedSegment.value = segments.value.find(segment => {
    if (segment.a.bulge) {
      pointToAdd.value = getNearestPointOnArc(
        segment.a,
        segment.b,
        currentPointWithPrecision.value,
        segment.a.bulge,
      );
    } else {
      pointToAdd.value = getNearestPointOnSegment(
        segment.a,
        segment.b,
        currentPointWithPrecision.value,
      );
    }

    pointToAdd.value = {
      x: Big(pointToAdd.value.x).round(precision.value).toNumber(),
      y: Big(pointToAdd.value.y).round(precision.value).toNumber(),
    };

    const shouldShowSuggestedVertex =
      ptDistSq(pointToAdd.value, currentPointWithPrecision.value) <
      scaledProximityDistance.value * scaledProximityDistance.value;
    return shouldShowSuggestedVertex;
  });
});

function addNewVertex() {
  const newVertices = addVertexToSegment(
    props.modelValue,
    selectedSegment.value,
    pointToAdd.value,
    precision.value,
  );

  emit('update:modelValue', {
    vertices: newVertices,
    newPoint: pointToAdd.value,
    selectedSegment: selectedSegment.value,
  });
}
</script>
<style>
.concrete__draggable-point {
  cursor: default !important;
}
</style>
