<template>
  <!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component -->
  <g
    v-if="html"
    ref="el"
    v-bind="$attrs"
    v-html="html"
  />
</template>

<script setup lang="ts">
import { render, Sketch } from '@crhio/jsdraft';
import { computed, ref } from 'vue';

import useDraggablePoint from '../composables/useDraggablePoint';
import { Feature, FeatureDefinition, StyleProp } from '../types';
import useDrag from '../composables/useDrag';

const { currentPointWithPrecision, startDrag, getDragDistance } = useDraggablePoint();

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

const html = computed(() => {
  const { feature, style } = props;
  const sketch = feature.func(new Sketch(), props.params)?.style(style);
  return sketch ? render(sketch, 'svg', { viewport: null }) : null;
});

const emit = defineEmits(['drag-start', 'dragging', 'drag-end']);
const el = ref(null);

useDrag(el, {
  start: (e) => {
    startDrag(currentPointWithPrecision.value);
    emit('drag-start', { x: e.x, y: e.y });
  },
  drag: () => {
    const distance = getDragDistance();
    emit('dragging', { distance });
  },
  end: () => {
    const distance = getDragDistance();
    emit('drag-end', { distance });
  }
});
</script>
