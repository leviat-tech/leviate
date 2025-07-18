<template>
  <DDraggablePath
    :path="sectionPath"
    :strokeWidth="2.5"
    :stroke="'black'"
    stroke-dasharray="30px 8px 3px 8px"
    :draggable="true"
    :color="'black'"
    @drag-start="startDraggingSection"
    @dragging="dragSection"
    @drag-end="endDraggingSection"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import useDrawing from '../composables/useDrawing';
import DDraggablePath from './DDraggablePath.vue';
import { ShapeParams, Point } from '../types';
import getExtents from '../utils/getExtents';

const props = defineProps<{
  shape: ShapeParams;
  viewDirection: 'top' | 'bottom' | 'left' | 'right';
}>();

const { state } = useDrawing();

const isHorizontal = props.viewDirection === 'top' || props.viewDirection === 'bottom';
const shapeExtents = computed(() => getExtents(props.shape.perimeter));
const sectionCutTemp = ref(
  isHorizontal
  ? {
      a: { x: shapeExtents.value.xmin, y: (shapeExtents.value.ymin + shapeExtents.value.ymax) / 2 },
      b: { x: shapeExtents.value.xmax, y: (shapeExtents.value.ymin + shapeExtents.value.ymax) / 2 },
    }
  : {
      a: { x: (shapeExtents.value.xmin + shapeExtents.value.xmax) / 2, y: shapeExtents.value.ymin },
      b: { x: (shapeExtents.value.xmin + shapeExtents.value.xmax) / 2, y: shapeExtents.value.ymax },
    }
);
let sectionDragPt = 0;
const pathOffset = 0.1;

const sectionPath = computed(() => {
  const e = shapeExtents.value;
  if (isHorizontal) {
    const a = {
      x: e.xmin - pathOffset,
      y: props.viewDirection === 'bottom' ? sectionCutTemp.value.a.y + pathOffset : sectionCutTemp.value.a.y - pathOffset,
    };
    const b = { x: e.xmin - pathOffset, y: sectionCutTemp.value.a.y };
    const c = { x: e.xmax + pathOffset, y: sectionCutTemp.value.b.y };
    const d = {
      x: e.xmax + pathOffset,
      y: props.viewDirection === 'bottom' ? sectionCutTemp.value.b.y + pathOffset : sectionCutTemp.value.b.y - pathOffset,
    };
    return `M${a.x},${a.y} L${b.x},${b.y} L${c.x},${c.y} L${d.x},${d.y}`;
  }
  const a = {
    x: props.viewDirection === 'left' ? sectionCutTemp.value.a.x + pathOffset : sectionCutTemp.value.a.x - pathOffset,
    y: e.ymin - pathOffset,
  };
  const b = { x: sectionCutTemp.value.a.x, y: e.ymin - pathOffset };
  const c = { x: sectionCutTemp.value.a.x, y: e.ymax + pathOffset };
  const d = {
    x: props.viewDirection === 'left' ? sectionCutTemp.value.a.x + pathOffset : sectionCutTemp.value.a.x - pathOffset,
    y: e.ymax + pathOffset,
  };
  return `M${a.x},${a.y} L${b.x},${b.y} L${c.x},${c.y} L${d.x},${d.y}`;
});

function startDraggingSection(p: Point) {
  sectionDragPt = isHorizontal ? p.y : p.x;
};

function moveSectionCut(diff: number) {
  sectionCutTemp.value =
    isHorizontal
      ? {
          a: { x: sectionCutTemp.value.a.x, y: sectionCutTemp.value.a.y + diff },
          b: { x: sectionCutTemp.value.b.x, y: sectionCutTemp.value.b.y + diff },
        }
      : {
          a: { x: sectionCutTemp.value.a.x + diff, y: sectionCutTemp.value.a.y },
          b: { x: sectionCutTemp.value.b.x + diff, y: sectionCutTemp.value.b.y },
        };
};

function dragSection(p: Point) {
  const diff =
    isHorizontal ? p.y - sectionDragPt : p.x - sectionDragPt;
  moveSectionCut(diff);
  sectionDragPt = isHorizontal ? p.y : p.x;
};

function endDraggingSection(p: Point) {
  const diff = isHorizontal ? p.y - sectionDragPt : p.x - sectionDragPt;
  moveSectionCut(diff);
  sectionDragPt = 0;
  state.sectionCut = sectionCutTemp.value;
};
</script>
