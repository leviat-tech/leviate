import Big from 'big.js';

import { recalculateBulge } from '../utils';
import updateVertex from './updateVertex';
import addVertex from './addVertex';

/**
 * Add a vertex to a given segment on a path
 * @param path
 * @param segment
 * @param newVertex - the reference vertex to add the new vertex after
 * @return the updated path containing the added vertex
 */
export default function addVertexToSegment(path, segment, newVertex, precision) {
  const pointA = segment.a;
  const newVertexFixed = {
    x: Big(newVertex.x).round(precision).toNumber(),
    y: Big(newVertex.y).round(precision).toNumber(),
  };

  if (pointA.bulge === 0) {
    return addVertex(path, { ...newVertex, ...newVertexFixed, bulge: 0 }, pointA);
  }

  const { startPointBulge, newVertexBulge } = recalculateBulge(newVertexFixed, segment);

  return updateVertex(
    path,
    pointA,
    { ...pointA, bulge: startPointBulge },
    { ...newVertexFixed, bulge: newVertexBulge },
  );
}
