<template>
  <div class="space-y-2" ref="el">
    <CNumericInput
      v-bind="inputProps"
      v-model="widthModel"
      prefix="w"
    />
    <CNumericInput
      v-bind="inputProps"
      v-model="heightModel"
      prefix="h"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { PointWithBulge, Dimensions } from '../../types';
import { calculateCentroid, getBoundingBox, translateVertices, subtractVectors } from '../../utils';
import useDrawing from '../../composables/useDrawing';

const { state, config, popup } = useDrawing();

const props = defineProps<{
  location: Point;
  vertices: PointWithBulge[];
}>();

const emit = defineEmits<{
  (e: 'update:vertices', vertices: PointWithBulge[]): void
}>();

const el = ref(null);

const boundingBox = computed<Dimensions>(() => getBoundingBox(props.vertices));

const widthModel = computed<number>({
  get: () => boundingBox.value.width,
  set: (width) => updateVertices({ width, height: heightModel.value })
});
const heightModel = computed<number>({
  get: () => boundingBox.value.height,
  set: (height) => updateVertices({ width: widthModel.value, height })
});

function updateVertices(dimensions: Dimensions): void {
  const vertices = [
    { x: 0, y: 0 },
    { x: dimensions.width, y: 0 },
    { x: dimensions.width, y: dimensions.height },
    { x: 0, y: dimensions.height },
  ];

  const centre = calculateCentroid(vertices);
  const translateBy = subtractVectors(props.location, centre);

  const newVertices = translateVertices(vertices, translateBy);

  emit('update:vertices', newVertices);
}

watch(heightModel, (newHeight, oldHeight) => {
  const diff = (newHeight - oldHeight) / 2;
  popup.y += diff / state.pxToSvg;
});

const inputProps = {
  stacked: true,
  noUnits: true,
  size: 'xs',
  unit: config.units
};

onMounted(() => {
  el.value.querySelector('input')?.select();
});
</script>
