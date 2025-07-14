import { Vector } from '@crhio/vector';
import { convertFromSI } from '@crhio/concrete/src/utils/units';
import { getSegmentsFromVertexList } from '../utils';
import { PERIMETER_DIM_OFFSET } from '../constants.ts';

// TODO: inject units ref
// const units = computed(() => useUnits('dimension').value);

export default {
  func(sketch, params) {
    const { vertices, shapeType, isInteractive } = params;

    const dims = getSegmentsFromVertexList(vertices).map((edge, i) => {
      const { a, b, bulge, length, vec } = edge;

      let options = null;

      if (isInteractive) {
        options = {
          dataset: {
            clickable: true,
            type: 'dimension:perimeter',
            // attr name needs to be hyphen case to be converted to camelcase when adding to element dataset
            'shape-type': shapeType,
            index: i,
          },
        };
      }
      const offsetMultiplier = params.getOffset?.(i) || 1;
      const dimOff = offsetMultiplier * PERIMETER_DIM_OFFSET;
      if (bulge === 0)
        return sketch.aligned_dim([a.x, a.y], [b.x, b.y], -dimOff, null, options).style('dim');

      const arc = sketch.new.arc([a.x, a.y], bulge, [b.x, b.y]);
      const perpVec = vec.rotate(Math.PI / 2);
      const offset = perpVec.scale((-bulge * length) / 2);
      const v1 = Vector({ x: a.x, y: a.y });
      const center = arc.entities[0].pc;
      const location = v1.add(vec.scale(length / 2)).add(offset);
      const r = convertFromSI(arc.entities[0].r, units.value).toFixed(0);
      // return sketch.radius_dim(arc.entities[0], [location.x, location.y]).style('dim'); //bug in jsdraft svg radius_dim
      return sketch.leader(`R${r}`, [location.x, location.y], [center.x, center.y]).style('dim');
    });

    return sketch.add(...dims);
  },
};
