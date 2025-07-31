<template>
  <g>
    <!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component -->
    <g
      v-if="html"
      ref="el"
      v-bind="$attrs"
      v-html="html"
      :class="isSelected && 'cursor-move'"
    />
    <template v-if="isSelected">
      <DDraggablePoint
        v-for="(point, anchor) in draggableAnchors"
        :point="point"
        @drag-start="startDrag(location)"
        @dragging="onDragAnchor(anchor)"
        @drag-end="onDragAnchor(anchor, true)"
        :color="isValid ? 'selected' : 'danger'"
        :class="cursorClassMap[anchor]" />
      />
    </template>
  </g>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { isEqual } from 'lodash-es';
import { render } from '@crhio/jsdraft';

import useDraggablePoint from '../composables/useDraggablePoint';
import { CircularFeature, Point, StyleProp } from '../types';
import DDraggablePoint from './DDraggablePoint.vue';
import { AvailableAnchorPoints, ANCHOR_POINTS, cursorClassMap } from '../constants';
import useDrag from '../composables/useDrag';
import useDrawing from '../composables/useDrawing';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  params: CircularFeature,
  shapeDraft: unknown;
  style: StyleProp,
  disabled?: boolean;
  isSelected?: boolean;
}>();

const emit = defineEmits(['dragging', 'drag-end']);

const el = ref<HTMLElement | null>(null);
const location = ref<Point>(props.params.location);
const diameter = ref<number>(props.params.diameter);
const isDraggingAnchor = ref<boolean>(false);

const { currentPointWithPrecision, startDrag, getDragDistance } = useDraggablePoint();
const { useValidityCheck } = useDrawing();

const isValid = useValidityCheck(props.params.id)

const draggableAnchors = computed(() => {
  const { x, y } = location.value;
  const r = diameter.value / 2;
  return {
    [ANCHOR_POINTS.LEFT]: { x: x - r, y },
    [ANCHOR_POINTS.RIGHT]: { x: x + r, y },
    [ANCHOR_POINTS.TOP]: { x, y: y + r },
    [ANCHOR_POINTS.BOTTOM]: { x, y: y - r },
  };
});

const html = computed(() => {
  const { style } = props;
  const params = {
    ...props.params,
    style,
    location: location.value,
    diameter: diameter.value,
  };

  const r = diameter.value / 2;
  const xmin = location.value.x - r;
  const xmax = location.value.x + r;
  const y = location.value.y;

  let sketch = props.shapeDraft.render('feature', [params], 'sketch');
  if (isDraggingAnchor.value) {
    sketch = sketch.add(
      sketch.aligned_dim([xmin, y], [xmax, y], 0),
    );
  }

  return sketch ? render(sketch, 'svg', { viewport: null, ...props.shapeDraft.settings }) : null;
});

useDrag(el, {
  drag: () => {
    location.value = currentPointWithPrecision.value;
    emit('dragging', 'feature');
  },
  end: () => {
    emit('drag-end', { location: currentPointWithPrecision.value });
  }
})

function onDragAnchor(anchor: AvailableAnchorPoints | number, isDragComplete?: boolean) {
  emit('dragging', 'anchor');

  isDraggingAnchor.value = true;

  const { x, y } = getDragDistance();

  const newRadius = (anchor === ANCHOR_POINTS.LEFT || anchor === ANCHOR_POINTS.RIGHT) ? x : y;

  diameter.value = Math.abs(newRadius * 2);

  if (isDragComplete) {
    isDraggingAnchor.value = false;
    emit('drag-end', { diameter: diameter.value });
  }
}

watch(
  () => props.params.location,
  (newLocation, prevLocation) => {
    if (isEqual(prevLocation, newLocation)) return;

    location.value = newLocation;
  }
);

watch(
  () => props.params.diameter,
  (newDiameter) => {
    diameter.value = newDiameter;
  }
);
</script>
