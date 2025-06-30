import { computed, ref } from 'vue';
import useDrawing from './useDrawing';
import useDraggablePoint from './useDraggablePoint';
import {
  getNearestPointOnArc,
  getNearestPointOnSegment,
  getSegmentsFromVertexList,
  ptDistSq,
} from '../utils';

function useClosestPointOnSegment(entity) {
  const { state, config } = useDrawing();
  const { currentPointWithPrecision } = useDraggablePoint();

  const pointToAddOnSegment = ref(null);
  const selectedSegment = ref(null);
  const scaledProximityDistance = computed(() => config.proximityDistance * state.pxToSvg);
  const segments = computed(() => getSegmentsFromVertexList(entity.value.shape.perimeter));

  const isCloseToEdge = computed(() => {
    let pointToAdd;
    const suggestedSegment = segments.value.find(segment => {
      if (segment.a.bulge) {
        pointToAdd = getNearestPointOnArc(
          segment.a,
          segment.b,
          currentPointWithPrecision.value,
          segment.a.bulge,
        );
      } else {
        pointToAdd = getNearestPointOnSegment(
          segment.a,
          segment.b,
          currentPointWithPrecision.value,
        );
      }

      const shouldShowSuggestedVertex =
        ptDistSq(pointToAdd, currentPointWithPrecision.value) <
        scaledProximityDistance.value * scaledProximityDistance.value;

      return shouldShowSuggestedVertex;
    });
    pointToAddOnSegment.value = pointToAdd;
    selectedSegment.value = suggestedSegment;
    return Boolean(suggestedSegment);
  });

  return { isCloseToEdge, pointToAddOnSegment, selectedSegment };
}

export default useClosestPointOnSegment;
