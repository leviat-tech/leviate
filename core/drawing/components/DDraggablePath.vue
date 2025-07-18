<template>
    <path
      style="fill:none; vector-effect: non-scaling-stroke !important; paint-order: stroke fill markers;"
      v-show="!disabled"
      ref="pathRef"
      :class="[cursorClass, strokeColor]"
      :d="path"
      :stroke-width="hitboxWidth"
      :stroke-opacity="hovered ? hitboxOpacity : 0"      
      @click="$emit('click', $event)"
      @mouseover="hoverPath"
      @mouseout="unhoverPath"
    />
    <path
      style="fill:none; vector-effect: non-scaling-stroke !important; paint-order: stroke fill markers;"
      class="pointer-events-none"
      :class="hoveredStrokeColor"
      :stroke-opacity="computedStrokeOpacity"
      :stroke-width="strokeWidth"
      :d="path"
      :stroke-dasharray="strokeDasharray"
    />
</template>

<script setup lang="ts">
import { drag as d3Drag } from 'd3-drag';
import { selectAll } from 'd3-selection';
import type { Selection } from 'd3-selection';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    path: string,
    color: string,
    disabled?: boolean,
    draggable?: boolean,
    active?: boolean,
    strokeWidth?: number,
    hitboxWidth?: number,
    strokeOpacity?: number,
    hoverStrokeOpacity?: number,
    hitboxOpacity?: number,
    activeStrokeOpacity?: number,
    strokeDasharray?: string,
  }>(),
  {
    color: 'default',
    path: 'M0,0 L1,0',
    disabled: false,
    draggable: true,
    active: false,
    strokeWidth: 3,
    hitboxWidth: 14,
    strokeOpacity: 0.6,
    hoverStrokeOpacity: 1,
    hitboxOpacity: 0.1,
    activeStrokeOpacity: 1,
    strokeDasharray: 'none',
  }
);

const emit = defineEmits(['click', 'drag-start', 'dragging', 'drag-end']);
const pathRef = ref(null);

const selection = ref<Selection<SVGPathElement, unknown, null, undefined> | null>(null);
const hovered = ref(false);

const colorMap: Record<string, string> = {
  default: 'stroke-black',
  info: 'stroke-status-info',
  magic: 'stroke-status-magic',
  success: 'stroke-status-success',
  warning: 'stroke-status-warning',
  danger: 'stroke-status-danger',
};

const strokeColor = computed(() => {
  return colorMap[props.color as keyof typeof colorMap] ?? colorMap.default;
});

const hoveredStrokeColor = computed(() => {
  if(!hovered && !props.active) return strokeColor;
  return colorMap[props.color as keyof typeof colorMap] ?? colorMap.default;
});

const computedStrokeOpacity = computed(() => {
  if (props.active) return props.activeStrokeOpacity;
  if (hovered) return props.hoverStrokeOpacity;
  return props.strokeOpacity;
});

const cursorClass = computed(() => {
  if(props.disabled) {
    return 'cursor-auto';
  }
  return 'cursor-move';
});

function dragstart(e: { x: number; y: number; }) {
  if (props.disabled) return;
  emit('drag-start', { x: e.x, y: e.y });
};

function dragged(e: { x: number; y: number; }) {
  if (props.disabled) return;
  emit('dragging', { x: e.x, y: e.y });
};

function dragend(e: { x: number; y: number; }) {
  if (props.disabled) return;
  emit('drag-end', { x: e.x, y: e.y });
};

function hoverPath() {
  hovered.value = true;
};

function unhoverPath() {
  hovered.value = false;
};

onMounted(() => {
  if (props.draggable) {
    selection.value = selectAll([pathRef.value]);
    if (selection.value) {
      selection.value.call(d3Drag().on('start', dragstart).on('drag', dragged).on('end', dragend));
    }
  }
});

onBeforeUnmount(() => {
  selection.value.on('.drag', null);
});
</script>