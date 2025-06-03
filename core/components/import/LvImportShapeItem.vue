<template>
  <button class="w-48 h-48 border p-8 relative rounded-sm"
          :class="shape.isSelected && 'border-brand-500'"
          @click="shape.isSelected = !shape.isSelected"
  >
    <div class="absolute inset-4 bottom-12" v-html="svg" />

    <div class="absolute inset-x-4 bottom-1.5 text-left font-mono text-xs">
      <div>W = {{ formatValue(width) }}</div>
      <div>H = {{ formatValue(height) }}</div>
    </div>

    <div class="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6"
         :class="shape.isSelected && 'bg-brand-500'">
      <CheckIcon class="w-4 h-4 text-white"  />
    </div>
  </button>
</template>

<script setup>
  import { Sketch, render } from '@crhio/jsdraft';
  import useShapeSelect, { FEATURE_TYPES, DXF_SHAPE_TYPES } from '../../composables/useShapeSelect';
  import { computed, ref, watchEffect } from 'vue';
  import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/vue/20/solid';

  const props = defineProps({
    shape: Object,
  });

const { getDraftShapeParams, shapeUnits, shapeUnitPrecision } = useShapeSelect();

  const indigo = '#201547';
  const gray = '#aaaaaa';
  const black = '#000000';
  const white = '#ffffff';
  const warning = '#ff8904';
  const widthPx = 158; // w-48 class in px

  const params = getDraftShapeParams(props.shape.vertices);
  const svg = ref('');
  const width = ref(null);
  const height = ref(null);
  //TODO: remove once curves could be handled properly
  const hasWarning = computed(() => (props.shape.features.cutouts?.some(c => Boolean(c.curves))))

  function formatValue(val) {
    const rounded = val.toFixed(shapeUnitPrecision.value);

    return parseFloat(rounded) + shapeUnits.value;
  }

  watchEffect(() => {
    const strokeColor = props.shape.isSelected ? indigo : gray;
    const fillColor = props.shape.isSelected ? indigo : black;

    const style = {
      fill: { color: fillColor, opacity: 0.05 },
      stroke: { color: strokeColor, opacity: 0.8 },
    };

    // Main shape
    const styleCutout = {
      default: {
        fill: { color: white, opacity: 1 },
        stroke: { color: black, opacity: 0.8 }
      },
      invalid: {
        fill: { color: warning, opacity: 1 },
      }
    };
    let sketch = new Sketch()
      .polyface(...params)
      .join()
      .style(style);

    const openings = [];

    props.shape.features.openings?.forEach((feat) => {
      if (feat.type === DXF_SHAPE_TYPES.LWPOLYLINE) {
        openings.push(
          new Sketch()
            .polyface(...feat.vertices.map(({ x, y }) => [x, y]))
            .translate(feat.position[0], feat.position[1])
            .join()
            .style(styleCutout)
        );
      } else if (feat.type === DXF_SHAPE_TYPES.CIRCLE) {
        openings.push(
          new Sketch().circle([feat.center.x, feat.center.y], feat.radius).join().style(styleCutout)
        );
        //pdf
      } else {
        const vertices = getDraftShapeParams(feat.vertices);
        openings.push(
          new Sketch().polyface(...vertices)
          .join()
          .style(feat.curves ? { ...styleCutout.default, ...styleCutout.invalid } : styleCutout.default)
        );
      }
    });

    openings.forEach((o) => {
      sketch = sketch.add(o);
    });

    // Calculate padding of 1px to prevent clipping
    const { xmin, xmax, ymin, ymax } = sketch.extents;
    const maxWidthOrHeight = Math.max(xmax - xmin, ymax - ymin);
    const unitPerPx = maxWidthOrHeight / widthPx;

    width.value = xmax - xmin;
    height.value = ymax - ymin;

    svg.value = render(sketch, 'svg', { fit: true, padding: unitPerPx });
  });
</script>
