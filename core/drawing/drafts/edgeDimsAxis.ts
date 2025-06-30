import { Vector } from '@crhio/vector';
import { convertFromSI } from '@crhio/concrete/src/utils/units';
import { getSegmentsFromVertexList } from '../utils';
import { Extents } from '../types/Drawings';
import { PARALLEL_DIM_OFFSET } from '../constants.ts';
import { Extents, PointWithBulge, Sketch, SketchPoint, Vertex } from '../types';

// TODO: inject units ref
// const units = computed(() => useUnits('dimension').value);

interface Params {
  vertices: PointWithBulge[];
  extents: Extents,
  isInteractive: boolean;
}

function getOrderedPointsFromVertices(vertices: PointWithBulge[], axis: 'x'|'y'): number[] {
  return vertices.map(vertex => vertex[axis]).sort();
}

export default {
  func(sketch: Sketch, params: Params) {
    const { vertices, extents, isInteractive } = params;
    const { xmin, xmax, ymin, ymax } = extents;
    const offset = 0.2;

    const widthDim = sketch.aligned_dim([xmin, ymin], [xmax, ymin], -offset);
    const heightDim = sketch.aligned_dim([xmin, ymin], [xmin, ymax], offset, null, { dataset: { id: 'id' } }).dataset({ id: 'someId' });

    const xPoints = getOrderedPointsFromVertices(vertices, 'x');
    const xDims = xPoints.slice(1).map((x, i) => {
      const start: SketchPoint = [xPoints[i], ymax];
      const end: SketchPoint = [x, ymax];
      const options = {
        dataset: {
          axis: 'x',
          value: x,
          type: 'dimension',
          clickable: true,
        }
      }
      return sketch.aligned_dim(start, end, offset, null, options)
    });

    const yPoints = getOrderedPointsFromVertices(vertices, 'y');
    const yDims = yPoints.slice(1).map((y, i) => {
      const start: SketchPoint = [xmax, yPoints[i]];
      const end: SketchPoint = [xmax, y];
      return sketch.aligned_dim(start, end, -offset)
    });

    return sketch.add(widthDim, heightDim, ...xDims, ...yDims);
  },
};
