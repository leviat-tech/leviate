import { computed, ref } from 'vue';
import Big from 'big.js';
import useDrawing from './useDrawing';
import { Point } from '../types';

export default function useDraggablePoint() {
  const { config, state } = useDrawing();
  const scale = computed(() => state.pxToSvg || 1);

  const fontSize = computed(() => {
    return config.fontSizePx * scale.value;
  });

  const transformText = computed(() => {
    return `scale(1 -1) translate(0, ${-1 * fontSize.value})`;
  });

  const isGridBypass = computed(() => {
    return state.keyModifiers.Control || state.keyModifiers.Meta;
  });

  const precision = computed(() => {
    const maxPrecision = 4;

    if (isGridBypass.value) {
      return state.gridPrecision === 1 ? 3 : maxPrecision;
    }

    return Math.min(state.gridPrecision, maxPrecision);
  });

  const currentPointWithPrecision = computed(() => {
    const { x, y } = state.currentPoint;

    // Allow snapping halfway between grid units when the grid size exceeds the given threshold
    const gridUnitThreshold = 16;
    const multiplier = state.pxPerGridUnit > gridUnitThreshold ? 2 : 1;

    return {
      x: Big(x).times(multiplier).round(precision.value).div(multiplier).toNumber(),
      y: Big(y).times(multiplier).round(precision.value).div(multiplier).toNumber(),
    };
  });

  const currentPointWithScaleFactor = computed(() => {
    const { x, y } = currentPointWithPrecision.value;
    const { unitScaleFactor } = config;

    return {
      x: Big(x).times(unitScaleFactor).round(precision.value).toNumber(),
      y: Big(y).times(unitScaleFactor).round(precision.value).toNumber(),
    };
  });

  const label = computed(() => {
    return Object.values(currentPointWithScaleFactor.value).join(', ');
  });

  const startPoint = ref<Point>({ x: 0, y: 0 });

  function startDrag(point: Point) {
    startPoint.value = point;
  }

  function getDragDistance(): Point {
    const { x, y } = currentPointWithPrecision.value;

    return {
      x: Big(x).minus(startPoint.value.x).toNumber(),
      y: Big(y).minus(startPoint.value.y).toNumber(),
    };
  }

  return {
    scale,
    label,
    fontSize,
    precision,
    transformText,
    startDrag,
    getDragDistance,
    currentPointWithPrecision,
  };
}
