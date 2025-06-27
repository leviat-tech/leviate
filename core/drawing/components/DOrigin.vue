<template>
  <!-- eslint-disable-next-line -->
  <g v-html="coord.html" />
</template>

<script setup>
import { computed } from 'vue';
import { Sketch, render } from '@crhio/jsdraft';

const props = defineProps({
  xColor: { type: String, default: '#ff0000' },
  yColor: { type: String, default: '#008000' },
});

const axes = computed(() => {
  const { xColor, yColor } = props;

  return { xColor, yColor };
});

const originMarker = () => {
  const sketch = new Sketch();
  const unit = 0.1;
  const circle = sketch.new
    .circle([0, 0], 0.2 * unit)
    .stroke('red', '1px')
    .fill('transparent');
  const upArrow = sketch.new
    .polycurve([0, 2 * unit], [-0.2 * unit, 1.2 * unit], [0.2 * unit, 1.2 * unit], [0, 2 * unit])
    .stroke(axes.value.yColor, '1px')
    .fill(axes.value.yColor);
  const rightArrow = upArrow.rotate(-90).stroke(axes.value.xColor, '1px').fill(axes.value.xColor);
  const upStalk = sketch.new.polycurve([0, 0], [0, 2 * unit]).stroke(axes.value.yColor, '1px');
  const rightStalk = sketch.new.polycurve([0, 0], [2 * unit, 0]).stroke(axes.value.xColor, '1px');

  return sketch.add(circle, upArrow, rightArrow, upStalk, rightStalk);
};

const coord = computed(() => {
  const html = render(originMarker(), 'svg', { viewport: null });
  return { html };
});
</script>
