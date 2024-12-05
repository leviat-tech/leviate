<template>
  <button class="w-48 h-48 border p-8 relative rounded-sm"
          :class="shape.isSelected && 'border-indigo'"
          @click="shape.isSelected = !shape.isSelected"
  >
    <div class="absolute inset-4 bottom-12" v-html="svg" />

    <div class="absolute inset-x-4 bottom-1.5 text-left font-mono text-xs">
      <div>W = {{ formatValue(width) }}</div>
      <div>H = {{ formatValue(height) }}</div>
    </div>

    <div class="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6"
         :class="shape.isSelected && 'bg-indigo'">
      <CheckIcon class="w-4 h-4 text-white"  />
    </div>
  </button>
</template>

<script setup>
import { Sketch, render } from '@crhio/jsdraft';
import useShapeSelect from '../../composables/useShapeSelect';
import { computed, ref, watchEffect } from 'vue';
import { CheckIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  shape: Object,
});

const { getShapeParams, shapeUnits, shapeUnitPrecision } = useShapeSelect();

const indigo = '#201547';
const gray = '#aaaaaa';
const black = '#000000';
const widthPx = 158; // w-48 class in px

const params = getShapeParams(props.shape);
const svg = ref('');
const width =  ref(null);
const height =  ref(null);

function formatValue(val) {
  const rounded = val.toFixed(shapeUnitPrecision.value);

  return parseFloat(rounded) + shapeUnits.value;
}

watchEffect(() => {
    const strokeColor = props.shape.isSelected ? indigo : gray;
    const fillColor = props.shape.isSelected ? indigo : black;
    const style = {
      fill: { color: fillColor, opacity: 0.05 },
      stroke: { color: strokeColor, opacity: 0.8 }
    };
    const sketch = new Sketch().polyface(...params).join().style(style);

    // Calculate padding of 1px to prevent clipping
    const { xmin, xmax, ymin, ymax } = sketch.extents;
    const maxWidthOrHeight = Math.max(xmax - xmin, ymax - ymin);
    const unitPerPx = maxWidthOrHeight / widthPx;

    width.value = xmax - xmin;
    height.value = ymax - ymin;

    svg.value = render(sketch, 'svg', { fit: true, padding: unitPerPx });
})
</script>
