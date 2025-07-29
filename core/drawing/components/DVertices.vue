<template>
  <!-- Current shape -->
  <g v-for="(vertex, i) in vertices" :key="i" :class="isDeleteEnabled && 'removable-points group'">
    <DAdjustableCross v-if="isDeleteEnabled" :vertex="vertex" :point-radius="config.vertexRadius" />
    <DDraggablePoint
      v-model="vertices"
      :point="vertex"
      :is-delete-active="isDeleteEnabled"
      :data-index="i"
      :data-shape-id="shapeId"
      data-type="node"
      :color="color || 'default'"
      @drag-start="onDragStart(vertex, i)"
      @dragging="onDragging"
      @drag-end="onDragEnd"
    />
  </g>

  <!--   New vertex on current path-->
  <DNewVertex
    v-if="isAddVertexEnabled"
    v-model="newVertexModel"
    :proximity-distance="config.proximityDistance"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DDraggablePoint from './DDraggablePoint.vue';
import DAdjustableCross from './DAdjustableCross.vue';
import DNewVertex from './DNewVertex.vue';
import useDrawing from '../composables/useDrawing.ts';
import { moveVertex } from '../operations';
import useDraggablePoint from '../composables/useDraggablePoint';
import { setToCounterClockwise } from '../utils';

const { config, state, tools } = useDrawing();

const { currentPointWithPrecision } = useDraggablePoint();

const MIN_SHAPE_VERTICES = 3;

const props = defineProps<{
  shapeId?: string;
  modelValue?: Array<unknown>;
  color?: 'default' | 'selected' | 'danger';
}>();

const emit = defineEmits(['update:modelValue', 'move:vertex', 'stop-moving:vertex']);
const currentIndex = ref(0);

const currentVertex = computed(() => ({
  ...props.modelValue[currentIndex.value],
}));

const newVertex = computed(() => ({
  ...currentVertex.value,
  ...currentPointWithPrecision.value,
}));

const vertices = computed({
  get: () => props.modelValue,
  set: (newVertices) => {
    emit('update:modelValue', newVertices);
  },
});

const newVertexModel = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val.vertices);
  },
});

const isAddVertexEnabled = computed(() => {
  if (!state.isPointerActive) return false;

  return tools.current.add_vertex || (tools.current.pointer && state.keyModifiers.Shift);
});

const isDeleteEnabled = computed(() => {
  if (vertices.value.length <= MIN_SHAPE_VERTICES) return false;

  return tools.current.delete_vertex || (tools.current.pointer && state.keyModifiers.Alt);
});

function onDragStart(vertex, i) {
  if (state.keyModifiers.Alt) {
    return;
  }

  state.isDragging = true;
  currentIndex.value = i;
  emit('move:vertex', true);
}

function onDragging() {
  if (!tools.current.pointer) return;

  vertices.value = moveVertex(vertices.value, currentIndex.value, newVertex.value);
}

function onDragEnd() {
  state.isDragging = false;

  if (!tools.current.pointer) return;

  const newVertices = moveVertex(vertices.value, currentIndex.value, newVertex.value);
  setToCounterClockwise(newVertices);
  vertices.value = newVertices;
  emit('stop-moving:vertex', false);
}
</script>
