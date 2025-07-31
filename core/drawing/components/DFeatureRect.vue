<template>
  <g>
    <!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component -->
    <g
      v-if="html"
      ref="el"
      v-bind="$attrs"
      v-html="html"
    />
    <template v-if="isSelected">
      <DDraggablePoint
        v-for="(point, anchor) in draggableAnchors"
        :point="point"
        :color="isValid ? 'selected' : 'danger'"
        :class="cursorClassMap[anchor]"
        @drag-start="startDrag(point)"
        @dragging="onAnchorDrag(anchor)"
        @drag-end="onAnchorDrag(anchor, true)"
      />
    </template>
  </g>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { isEqual } from 'lodash-es';
import { render } from '@crhio/jsdraft';

import useDraggablePoint from '../composables/useDraggablePoint';
import useDrag from '../composables/useDrag';
import useDrawing from '../composables/useDrawing';
import { Extents, Point, PointWithBulge, RectangularFeature, StyleProp } from '../types';
import DDraggablePoint from './DDraggablePoint.vue';
import { ANCHOR_POINTS, AvailableAnchorPoints, cursorClassMap } from '../constants';
import { addVectors, calculateCentroid, translateVertices } from '../utils';
import getExtents from '../utils/getExtents';

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

const emit = defineEmits(['drag-start', 'dragging', 'drag-end']);

const vertices = ref<PointWithBulge[]>(props.params.vertices);
const isDraggingAnchor = ref(false);

const { useValidityCheck } = useDrawing();

const isValid = useValidityCheck(props.params.id);

const centre = computed<Point>(() => {
  return calculateCentroid(vertices.value);
});

const extents = computed(() => getExtents(vertices.value));

const draggableAnchors = computed(() => {
  const { xmin, xmax, ymin, ymax } = extents.value;
  const { x, y } = centre.value;

  return {
    [ANCHOR_POINTS.LEFT]: { x: xmin, y },
    [ANCHOR_POINTS.RIGHT]: { x: xmax, y },
    [ANCHOR_POINTS.TOP]: { x, y: ymax },
    [ANCHOR_POINTS.BOTTOM]: { x, y: ymin },
    [ANCHOR_POINTS.TOP_LEFT]: { x: xmin, y: ymax },
    [ANCHOR_POINTS.TOP_RIGHT]: { x: xmax, y: ymax },
    [ANCHOR_POINTS.BOTTOM_LEFT]: { x: xmin, y: ymin },
    [ANCHOR_POINTS.BOTTOM_RIGHT]: { x: xmax, y: ymin },
  };
});

const html = computed(() => {
  const { style } = props;
  const params = {
    ...props.params,
    style,
    vertices: vertices.value,
  };
  const { xmin, xmax, ymin, ymax } = extents.value;
  let sketch = props.shapeDraft.render('feature', [params], 'sketch');
  if (props.isSelected && isDraggingAnchor.value) {
    sketch = sketch.add(
      sketch.aligned_dim([xmin, ymin], [xmin, ymax], 0.1),
      sketch.aligned_dim([xmin, ymin], [xmax, ymin], -0.1),
    );
  }

  return sketch ? render(sketch, 'svg', { viewport: null, ...props.shapeDraft.settings }) : null;
});

const el = ref<HTMLElement | null>(null);

const { currentPointWithPrecision, startDrag, getDragDistance } = useDraggablePoint();

useDrag(el, {
  start: () => {
    startDrag(centre.value);
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

async function onAnchorDrag(anchor: AvailableAnchorPoints, isDragComplete?: boolean) {
  isDraggingAnchor.value = true;
  emit('dragging', 'anchor');

  const translateBy = getDragDistance();
  const extents = getExtents(props.params.vertices);
  const pointValuesToModify = getPointValuesToModify(anchor, extents);

  vertices.value = getModifiedVertices(props.params.vertices, pointValuesToModify, translateBy);

  if (isDragComplete) {
    isDraggingAnchor.value = false;
    emit('drag-end', { vertices: vertices.value });
  }
}

function getPointValuesToModify(anchor: AvailableAnchorPoints, extents: Extents): Partial<Point> | null {
  switch (anchor) {
    case ANCHOR_POINTS.BOTTOM:
      return { y: extents.ymin };
    case ANCHOR_POINTS.TOP:
      return { y: extents.ymax };
    case ANCHOR_POINTS.LEFT:
      return { x: extents.xmin };
    case ANCHOR_POINTS.RIGHT:
      return { x: extents.xmax };
    case ANCHOR_POINTS.TOP_LEFT:
      return { x: extents.xmin, y: extents.ymax };
    case ANCHOR_POINTS.TOP_RIGHT:
      return { x: extents.xmax, y: extents.ymax };
    case ANCHOR_POINTS.BOTTOM_LEFT:
      return { x: extents.xmin, y: extents.ymin };
    case ANCHOR_POINTS.BOTTOM_RIGHT:
      return { x: extents.xmax, y: extents.ymin };
  }

  return null;
}

function getModifiedVertices(
  vertices: PointWithBulge[],
  pointValuesToModify: Partial<Point> | null,
  translateBy: Point
): PointWithBulge[] {
  if (!pointValuesToModify) {
    console.warn('Could not calculate which vertices to modify');
    return vertices;
  }

  return vertices.map((vertex: PointWithBulge) => {
    if (pointValuesToModify.x === vertex.x && pointValuesToModify.y === vertex.y) {
      return { ...addVectors(vertex, translateBy), bulge: vertex.bulge };
    } else if (pointValuesToModify.x === vertex.x) {
      return { ...addVectors(vertex, { x: translateBy.x, y: 0 }), bulge: vertex.bulge };
    } else if (pointValuesToModify.y === vertex.y) {
      return { ...addVectors(vertex, { y: translateBy.y, x: 0 }), bulge: vertex.bulge };
    } else {
      return vertex;
    }

  });
}

/**
 * location is only used when placing a new rect feature
 * so translate the rect central to the current pointer position
 */
watch(
  () => props.params.location,
  (newLocation, prevLocation) => {
    if (isEqual(prevLocation, newLocation)) return;

    const translateBy = {
      x: newLocation.x - centre.value.x,
      y: newLocation.y - centre.value.y,
    };
    vertices.value = translateVertices(vertices.value, translateBy);
  }
)

/**
 * feature is rendered using local vertices ref so ensure these
 * are updated when the params are changed externally e.g. via form inputs
 */
watch(
  () => props.params.vertices,
  (newVertices) => {
    vertices.value = newVertices;
  }
);
</script>
