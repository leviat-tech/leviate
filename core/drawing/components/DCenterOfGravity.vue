<template>
  <!-- eslint-disable-next-line -->
  <g v-html="cog.html" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Sketch, render } from '@crhio/jsdraft';

const props = defineProps<{
  cog: number[];
}>();


const cogMarker = () => {
    const sketch = new Sketch();
    
    const r = 0.05; //radius
    const f = 1.3; //multiply factor for cross-hair length

    const circle = sketch.new.circle([0, 0], r).fill('red');
    const sector1 = sketch.polycurve([0, -r], [0,0], [r,0]).close(-0.42);
    const sector2 = sketch.polycurve([-r,0], [0,0], [0,r]).close(0.42);

    const crosshair1 = sketch.segment([0,-r*f], [0,r*f]);
    const crosshair2 = sketch.segment([-r*f,0], [r*f,0]);
    
    return sketch.add(circle, crosshair1, sector1, sector2, crosshair2)
        .z(100)
        .translate(...props.cog)
};

const cog = computed(() => {
  const html = render(cogMarker(), 'svg', { viewport: null });
  return { html };
});
</script>
