<template>
  <div class="flex h-full w-full overflow-hidden relative draw_viewport">
    <svg
      ref="svgRef"
      class="flex-1 -scale-y-100"
      :viewBox="vbString"
      @click="handleClick"
      @mousewheel="handleMousewheel"
      @wheel="handleMousewheel"
      @pointerdown="handleMousedown"
      @pointermove="handleMousemove"
      @pointerup="handleMouseup"
      @dblclick="handleDoubleClick"
      @mouseleave="handleMouseLeave"
    >
      <g
        ref="contentsRef"
        class="drawing-contents"
        :transform="`translate(${dragOffset.x} ${dragOffset.y})`"
      >
        <DGridlines
          v-if="showGrid"
          :view-box="viewport.viewBox"
          :drag-offset="dragOffset"
          :px-to-svg="pxToSvgUnits"
        />

        <slot />
      </g>
    </svg>
    <div class="absolute left-2 top-2 bg-white opacity-95 flex flex-col items-center">
      <slot name="toolbar" />
    </div>
    <div class="absolute flex items-center bg-white opacity-95">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  provide,
  inject,
  nextTick,
} from 'vue';
import useDrawing from '../composables/useDrawing.ts';
import DGridlines from './DGridlines.vue';

const props = defineProps({
  name: {
    type: String,
    default: 'DEFAULT',
  },
  padding: {
    type: Number,
    default: 0,
  },
  extents: {
    type: Object,
    default: () => ({
      xmin: -10,
      ymin: -10,
      xmax: 10,
      ymax: 10,
    }),
  },
  showGrid: { type: Boolean },
  currentTool: { type: String, default: 'select' },
});

const emit = defineEmits([
  'input',
  'click',
  'mousedown',
  'mousemove',
  'mouseup',
  'change-tool',
  'keyDown',
  'deleteKey',
  'escapeKey',
]);

provide('viewportName', props.name);

const { state, sketch, openPopup, closePopup, popup, tools } = useDrawing(props.name);

let isPanning = false;
let isZooming = false;

let hoverPt = { x: 0, y: 0 };
const screenPt = { x: 0, y: 0 };
const dragOffset = reactive({ x: 0, y: 0 });
const dragFrom = { x: 0, y: 0 };
const viewport = reactive({
  viewBox: {
    minX: 0,
    minY: 0,
    width: 1,
    height: 1,
  },
  el: {
    width: 1,
    height: 1,
  },
});
const zoomProps = {
  origin: { x: 0, y: 0 },
  screenY: 0,
};

const aspectRatio = computed(() => {
  return viewport.el.width / viewport.el.height;
});

const extents = computed(() => {
  return sketch.value?.extents || props.extents;
});

const ZOOM_LIMITS = {
  MIN: 1e-5,
  MAX: 0.1,
};

// The point relative to the SVG viewbox
// Does not take zoom scale into account
const svgPt = ref({ x: 0, y: 0 });
const hasZoomed = ref(false);
const tempTool = ref(null);

const svgRef = ref(null);
const contentsRef = ref(null);

const viewportContainer = inject('viewportContainer');

const vbString = computed(() => {
  const { minX, minY, width, height } = viewport.viewBox;
  return `${minX} ${minY} ${width} ${height}`;
});

const pxToSvgUnits = computed(() => {
  return viewport.viewBox.width / viewport.el.width;
});

const maximized = computed(() => {
  return viewportContainer?.maximized;
});

const domToSVGCoords = (el, pt) => {
  const { x, y } = pt.matrixTransform(el.getScreenCTM().inverse());
  return { x, y };
};

const zoomTo = ({ xmin, ymin, xmax, ymax }) => {
  const width = xmax - xmin;
  const height = ymax - ymin;

  let newWidth;
  let newHeight;
  if (aspectRatio.value > width / height) {
    // Stretch horizontally
    newWidth = aspectRatio.value * height;
    newHeight = height;
  } else {
    // Stretch vertically
    newWidth = width;
    newHeight = width / aspectRatio.value;
  }

  const widthDifference = newWidth - width;
  const heightDifference = newHeight - height;

  viewport.viewBox = {
    minX: xmin - widthDifference / 2,
    minY: ymin - heightDifference / 2,
    width: newWidth,
    height: newHeight,
  };
};

const zoomToExtents = () => {
  const { padding } = props;
  const { xmin, xmax, ymin, ymax } = extents.value;

  const extentsWithPadding = {
    xmin: xmin - padding,
    xmax: xmax + padding,
    ymin: ymin - padding,
    ymax: ymax + padding,
  };

  zoomTo(extentsWithPadding);
};

const setMousePt = e => {
  state.isPointerActive = true;
  hoverPt.x = e.clientX;
  hoverPt.y = e.clientY;
  const rect = svgRef.value.getBoundingClientRect();
  screenPt.x = e.clientX - rect.left;
  screenPt.y = e.clientY - rect.top;
  state.currentPoint = domToSVGCoords(contentsRef.value, hoverPt);
  svgPt.value = domToSVGCoords(svgRef.value, hoverPt);
  emit('input', svgPt.value);
};

const panstart = () => {
  closePopup();
  isPanning = true;
  tempTool.value = props.currentTool;
  emit('change-tool', 'pan');
  const { x, y } = svgPt.value;
  Object.assign(dragFrom, { x, y });
};

const pan = () => {
  const { x, y } = svgPt.value;
  dragOffset.x = x - dragFrom.x;
  dragOffset.y = y - dragFrom.y;
};

const panend = () => {
  const { x, y } = svgPt.value;
  dragOffset.x = x - dragFrom.x;
  dragOffset.y = y - dragFrom.y;
  viewport.viewBox.minX -= dragOffset.x;
  viewport.viewBox.minY -= dragOffset.y;
  dragOffset.x = 0;
  dragOffset.y = 0;
  isPanning = false;
  emit('change-tool', tempTool.value);
};

const calculateNewOffset = (oldLength, newLength, oldMinPoint, currentPoint) => {
  const difference = newLength - oldLength;
  const percentOffset = (currentPoint - oldMinPoint) / oldLength;
  const svgOffset = difference * percentOffset;
  return oldMinPoint - svgOffset;
};

const zoomAtPoint = (point, zoomFactor) => {
  if (
    (zoomFactor < 1 && pxToSvgUnits.value <= ZOOM_LIMITS.MIN) ||
    (zoomFactor > 1 && pxToSvgUnits.value > ZOOM_LIMITS.MAX)
  )
    return;

  const { x, y } = point;

  const oldMinX = viewport.viewBox.minX;
  const oldMinY = viewport.viewBox.minY;
  const oldWidth = viewport.viewBox.width;
  const oldHeight = viewport.viewBox.height;

  const newWidth = oldWidth * zoomFactor;
  const newHeight = oldHeight * zoomFactor;

  const newMinX = calculateNewOffset(oldWidth, newWidth, oldMinX, x);
  const newMinY = calculateNewOffset(oldHeight, newHeight, oldMinY, y);

  viewport.viewBox = {
    minX: newMinX,
    minY: newMinY,
    width: newWidth,
    height: newHeight,
  };
};

const handleMousewheel = e => {
  const scaleAmount = 1.1;
  const zoomFactor = e.deltaY > 0 ? scaleAmount : 1 / scaleAmount;

  setMousePt(e);
  zoomAtPoint(state.currentPoint, zoomFactor);
};

const zoomstart = () => {
  isZooming = true;

  Object.assign(zoomProps, {
    origin: { ...state.currentPoint },
    screenY: screenPt.y,
  });
};

const zoom = () => {
  const scaleAmount = 1.05;
  const zoomFactor = zoomProps.screenY < screenPt.y ? scaleAmount : 1 / scaleAmount;

  zoomProps.screenY = screenPt.y;

  zoomAtPoint(zoomProps.origin, zoomFactor);
};

const zoomend = () => {
  isZooming = false;
};

const documentMouseleave = () => {
  if (isPanning) panend();
  if (isZooming) zoomend();
};

const handleClick = e => {
  emit('click', e);
};

const handleMouseLeave = () => {
  if (popup.isOpen) return;

  state.currentPoint = { x: 0, y: 0 };
  state.isPointerActive = false;
};

const handleMousedown = e => {
  state.isChildMenuOpen = false;
  closePopup();
  emit('mousedown', e);
  setMousePt(e);

  e.target.setPointerCapture(e.pointerId);

  // In this case we want just to scroll view
  if (e.button !== 2) {
    state.activeFeatureId = null;
  }

  if (e.button === 2 || props.currentTool === 'pan') {
    panstart();
  } else if (e.button === 1) {
    zoomToExtents();
  } else if (props.currentTool === 'zoom') {
    zoomstart();
  } else if (state.currentTool === 'pointer') {
    if (e.target.dataset.type === 'opening') {
      state.activeFeatureId = e.target.dataset.id;
    }
  } else if (state.currentTool === tools.round_off && e.target.dataset?.type === 'node') {
    openPopup(e, e.target.dataset);
  }
};

const handleMousemove = e => {
  emit('mousemove', e);
  setMousePt(e);
  if (isPanning) {
    pan();
  } else if (isZooming) {
    zoom();
  }
};

const handleDoubleClick = e => {
  const dataset = e.target.dataset;

  if (dataset?.type === 'node' && state.currentTool !== tools.round_off) {
    openPopup(e, dataset);
  }
};

const handleMouseup = e => {
  const dataset = e.target.dataset;

  const hasData = Object.keys(dataset).length > 0;

  if (!hasData && !e.target.classList.contains('draggable-point')) {
    state.selectedFeatureId = null;
  }

  if (dataset?.type?.startsWith('dimension')) {
    openPopup(e, dataset);
    return;
  }

  emit('mouseup', e, { ...dataset });
  setMousePt(e);
  svgRef.value.releasePointerCapture(e.pointerId);
  if (isPanning) {
    panend();
  } else if (isZooming) {
    zoomend();
  }
};

const modifierKeys = ['Control', 'Alt', 'Shift', 'Meta'];
const actionKeys = ['Escape', 'Backspace', 'Delete'];

const handleKeyDown = e => {
  if (e.key === 'Alt') e.preventDefault();
  if (modifierKeys.includes(e.key)) {
    state.keyModifiers[e.key] = true;
  }
  if (actionKeys.includes(e.key)) {
    if (e.target.tagName !== 'INPUT') {
      state.actionKeys[e.key] = true;
      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          emit('deleteKey', e);
          break;
        case 'Escape':
          emit('escapeKey', e);
          break;
      }
    }
  }

  if (e.key === 'Escape') {
    closePopup();
  }

  emit('keyDown', e);
};

const handleKeyUp = e => {
  if (e.key === 'Alt') e.preventDefault();

  if (modifierKeys.includes(e.key)) {
    state.keyModifiers[e.key] = false;
  }
  if (actionKeys.includes(e.key)) {
    state.actionKeys[e.key] = false;
  }
};

const resizeHandler = () => {
  viewport.el.width = svgRef.value.clientWidth;
  viewport.el.height = svgRef.value.clientHeight;

  viewport.viewBox.height = viewport.viewBox.width / aspectRatio.value;
};

const resizeObserver = new ResizeObserver(resizeHandler);

onMounted(async () => {
  await nextTick();
  svgRef.value.addEventListener('contextmenu', e => {
    e.preventDefault();
    state.isChildMenuOpen = false;
  });
  hoverPt = svgRef.value.createSVGPoint();
  document.addEventListener('pointerleave', documentMouseleave);
  resizeObserver.observe(svgRef.value);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  setTimeout(() => {
    resizeHandler();
    zoomToExtents();
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerleave', documentMouseleave);

  resizeObserver.disconnect();
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});

watch(extents, val => {
  if (!hasZoomed.value && val) {
    zoomToExtents();
    hasZoomed.value = true;
  }
});

watch(pxToSvgUnits, val => {
  if (val) {
    state.pxToSvg = val;
  }
});

defineExpose({
  zoomToExtents,
});
</script>

<style>
svg text {
  cursor: default;
  user-select: none;
}

svg text[data-clickable] {
  cursor: pointer;
}
</style>
