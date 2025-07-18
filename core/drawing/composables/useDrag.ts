import { drag as d3Drag } from 'd3-drag';
import { selectAll } from 'd3-selection';
import { onBeforeUnmount, onMounted, ref, Ref } from 'vue';
import { Point } from '../types';
import useDrawing from './useDrawing';

type D3DragEvent = DragEvent & { sourceEvent: DragEvent };
type DragHandler = (e: D3DragEvent) => void;
type Handlers = {
  start?: DragHandler;
  drag?: DragHandler;
  end?: DragHandler;
}

// Drag threshold in px to avoid drag event firing on click
const DRAG_THRESHOLD_PX = 4;

export default function useDrag(
  elRef: Ref<HTMLElement | null>,
  handlers: Handlers,
  disabledRef?: Ref<boolean>
) {
  // The initial screen position in px, used to determine when dragging should start
  let initialPosition: Point = { x: 0, y: 0 };
  let isDragStarted = false;

  const { state } = useDrawing();
  const selection = ref(null);

  function start(e: D3DragEvent) {
    initialPosition = { x: e.sourceEvent.x, y: e.sourceEvent.y };

    if (canDrag(e)) handlers.start?.(e);
  }

  function drag(e: D3DragEvent) {
    if (!canDrag(e)) return;

    state.isDragging = true;

    // Only call start handler once drag threshold has been exceeded
    if (!isDragStarted) {
      handlers.start?.(e);
      isDragStarted = true;
    }

    handlers.drag?.(e);
  }

  function end(e: D3DragEvent) {
    isDragStarted = false;

    if (canDrag(e)) handlers.end?.(e);
  }

  function canDrag(e: D3DragEvent) {
    if (disabledRef?.value === true) return false;

    const { x, y } = e.sourceEvent;

    const dx = x - initialPosition.x;
    const dy = y - initialPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance >= DRAG_THRESHOLD_PX;
  }

  onMounted(() => {
    selection.value = selectAll([elRef.value]);
    selection.value.call(d3Drag()
      .filter(function(e) {
        return !e.button;
      })
      .on('start', start)
      .on('drag', drag)
      .on('end', end));
  });

  onBeforeUnmount(() => {
    selection.value?.on('.drag', null);
  });
}
