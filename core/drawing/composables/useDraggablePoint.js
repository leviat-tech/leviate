import { computed } from 'vue';
import Big from 'big.js';
import useDrawing from './useDrawing.ts';

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
    if (isGridBypass.value) {
      return state.currentPoint;
    }

    const { x, y } = state.currentPoint;

    return {
      x: Big(x).round(precision.value).toNumber(),
      y: Big(y).round(precision.value).toNumber(),
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

  return {
    scale,
    label,
    fontSize,
    precision,
    transformText,
    currentPointWithPrecision,
  };
}
