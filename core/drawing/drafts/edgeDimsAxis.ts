import { Vector } from '@crhio/vector';
import { convertFromSI } from '@crhio/concrete/src/utils/units';
import { getSegmentsFromVertexList } from '../utils';
import { Extents, Vertex } from '../types';
import { PARALLEL_DIM_OFFSET } from '../constants.ts';

// TODO: inject units ref
// const units = computed(() => useUnits('dimension').value);

interface Params {
  vertices: Vertex[];
  extents: Extents,
  shapeType: string;
  isInteractive: boolean;
}

export default {
  func(sketch, params: Params) {
    const { vertices, extents, shapeType, isInteractive } = params;
    const { xmin, xmax, ymin, ymax } = extents;

    const dims = [];
    const widthDim = sketch.aligned_dim([])

    return sketch.add(...dims);
  },
};
