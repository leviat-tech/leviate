import { computed } from 'vue';
import { transact } from '@crhio/leviate';
import { Vector } from '@crhio/vector';
import useDraggablePoint from '../composables/useDraggablePoint';
import { getSegmentsFromVertexList } from '../utils';

export default function useDraggableGroup(entity) {
  const segments = computed(() => getSegmentsFromVertexList(entity.value.shape.perimeter));
  const { currentPointWithPrecision } = useDraggablePoint();

  function onDragging(group) {
    transact(() => {
      group.distance = moveGroup(group);
    });
  }

  function onDragEnd(group) {
    const distance = moveGroup(group);
    transact(() => {
      group.distance = distance;
    });
  }

  function moveGroup(groupToMove) {
    const activeSegment = segments.value[groupToMove.edgeNumber - 1];
    const v1 = Vector({
      x: currentPointWithPrecision.value.x,
      y: currentPointWithPrecision.value.y,
    });
    const v2 = Vector({ x: activeSegment.a.x, y: activeSegment.a.y });
    const segmentVec = activeSegment.vec;
    const angle = v1.subtract(v2).angleBetween(segmentVec) || 0;

    const distance = Math.min(
      Math.abs(v1.dist(v2) * Math.cos(angle)),
      activeSegment.length - groupToMove.length,
    );

    return distance;
  }

  return { onDragging, onDragEnd };
}
