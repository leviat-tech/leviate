import { Vector } from '@crhio/vector';
import { convertFromSI } from '@crhio/concrete/src/utils/units';
import { Extents, PointWithBulge, Sketch, SketchPoint } from '../types';
import { AXIS_DIM_OFFSET, DIMENSION_TYPES } from "../constants";

// TODO: inject units ref
// const units = computed(() => useUnits('dimension').value);

interface Params {
  vertices: PointWithBulge[];
  extents: Extents,
}

interface AxisDimOptions {
  dataset: {
    axis: 'x'|'y';
    value: number;
    type: string;
    clickable: boolean;
  }
}

function getOrderedPointsFromVertices(vertices: PointWithBulge[], axis: 'x'|'y'): number[] {
  return vertices.map(vertex => vertex[axis]).sort();
}

export default {
  func(sketch: Sketch, params: Params) {
    const { vertices, extents } = params;
    const { xmin, xmax, ymin, ymax } = extents;
    const getDimOptions = (axis: 'x'|'y', value: number): AxisDimOptions => ({
      dataset: {
        axis,
        value,
        type: DIMENSION_TYPES.AXIS,
        clickable: true
      }
    })

    const widthDim = sketch.aligned_dim([xmin, ymin], [xmax, ymin], -AXIS_DIM_OFFSET, null, getDimOptions('x', xmax));
    const heightDim = sketch.aligned_dim([xmin, ymin], [xmin, ymax], AXIS_DIM_OFFSET, null, getDimOptions('y', ymax));

    const xPoints = getOrderedPointsFromVertices(vertices, 'x');
    const xDims = xPoints.slice(1).map((x, i) => {
      const start: SketchPoint = [xPoints[i], ymax];
      const end: SketchPoint = [x, ymax];
      return sketch.aligned_dim(start, end, AXIS_DIM_OFFSET, null, getDimOptions('x', x));
    });

    const yPoints = getOrderedPointsFromVertices(vertices, 'y');
    const yDims = yPoints.slice(1).map((y, i) => {
      const start: SketchPoint = [xmax, yPoints[i]];
      const end: SketchPoint = [xmax, y];
      return sketch.aligned_dim(start, end, -AXIS_DIM_OFFSET, null, getDimOptions('y', y));
    });

    return sketch.add(widthDim, heightDim, ...xDims, ...yDims);
  },
};
