<template>
  <g>
    <!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component -->
    <g
      v-if="html"
      ref="el"
      @click="$emit('click', vertices)"
      v-bind="$attrs"
      v-html="html"
    />
    <template v-if="isSelected">
      <DVertices
        v-model="vertices"
        :color="isValid ? 'selected' : 'danger'"
        :shape-id="params.id"
        @move:vertex="onVertexDrag(true)"
        @stop-moving:vertex="onVertexDrag(false)"
      />
    </template>
  </g>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { render } from '@crhio/jsdraft';

import useDraggablePoint from '../composables/useDraggablePoint';
import useDrawing from '../composables/useDrawing';
import { PointWithBulge, RectangularFeature, StyleProp } from '../types';
import { translateVertices } from '../utils';
import useDrag from '../composables/useDrag';
import getExtents from '../utils/getExtents';
import DVertices from './DVertices.vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  params: RectangularFeature,
  shapeDraft: unknown,
  style: StyleProp,
  disabled?: boolean;
  isSelected?: boolean;
  isPreviewEnabled?: boolean;
}>();

const emit = defineEmits(['click', 'drag-start', 'dragging', 'drag-end']);

const vertices = ref<PointWithBulge[]>(props.params.vertices);
const isDraggingVertex = ref<boolean>(false);

const html = computed(() => {
  const { style } = props;
  const params = {
    ...props.params,
    style,
    vertices: vertices.value,
  };
  const extents = getExtents(vertices.value);
  const { xmin, xmax, ymin, ymax } = extents;
  let sketch = props.shapeDraft.render('feature', [params], 'sketch');
  if (props.isSelected && isDraggingVertex.value) {
    sketch = sketch.add(
      sketch.aligned_dim([xmin, ymin], [xmin, ymax], 0.1),
      sketch.aligned_dim([xmin, ymin], [xmax, ymin], -0.1),
    );
  }

  return sketch ? render(sketch, 'svg', { viewport: null, ...props.shapeDraft.settings }) : null;
});

const el = ref<HTMLElement | null>(null);

const { currentPointWithPrecision, startDrag, getDragDistance } = useDraggablePoint();
const { useValidityCheck } = useDrawing();

const isValid = useValidityCheck(props.params.id)

function onVertexDrag(isDragging: boolean) {
  isDraggingVertex.value = isDragging;

  if (isDragging) {
    emit('dragging');
  } else {
    emit('drag-end', { vertices: vertices.value });
  }
}

useDrag(el, {
  start: () => {
    startDrag(vertices.value[0]);
    const distance = getDragDistance();
    // Move the feature so that the cursor and reference point is in the centre
    vertices.value = translateVertices(vertices.value, distance);
  },
  drag: () => {
    const dragDistance = getDragDistance();
    vertices.value = translateVertices(props.params.vertices, dragDistance);
    emit('dragging', 'feature');
  },
  end: () => {
    emit('drag-end', { vertices: vertices.value });
  }
});

watch(
  () => props.params.vertices,
  (newVertices) => vertices.value = newVertices,
);
</script>
