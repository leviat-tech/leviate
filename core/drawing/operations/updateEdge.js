import Big from 'big.js';
import { getSegmentsFromVertexList, pt2fixed } from '../utils';
import moveVertex from './moveVertex';
import { DIM_ACHOR } from '../constants.ts';

/**
 * Update an edge by expanding left, right, or both directions
 * @param { array } path
 * @param { string | number } edgeIndex
 * @param { number } newLength
 * @param { 'start' | 'end' | 'centre' } anchorPoint
 */
export default function updateEdge(path, edgeIndex, newLength, anchorPoint) {
  const segment = getSegmentsFromVertexList(path)[edgeIndex];

  const { a, b } = segment;

  // Cast index to a number in case a string is passed in
  const startIndex = Number(edgeIndex);
  const endIndex = startIndex === path.length - 1 ? 0 : startIndex + 1;

  const oldWidth = b.x - a.x;
  const oldHeight = b.y - a.y;

  const oldLength = Math.sqrt(oldWidth ** 2 + oldHeight ** 2);
  const lengthDiff = newLength - oldLength;
  const angle = Math.acos(oldWidth / oldLength);

  const changeXRaw = lengthDiff * Math.cos(angle);
  const changeYRaw = lengthDiff * Math.sin(angle);
  const precision = 12;
  const changeX = Big(changeXRaw).round(precision).toNumber();
  let changeY = Big(changeYRaw).round(precision).toNumber();

  if (b.y < a.y) {
    changeY = -changeY;
  }

  switch (anchorPoint) {
    case DIM_ACHOR.start:
      return moveVertex(
        path,
        endIndex,
        pt2fixed({
          x: b.x + changeX,
          y: b.y + changeY,
        }),
      );
    case DIM_ACHOR.centre: {
      const newVertices = moveVertex(
        path,
        endIndex,
        pt2fixed({
          x: b.x + changeX * 0.5,
          y: b.y + changeY * 0.5,
        }),
      );
      return moveVertex(
        newVertices,
        startIndex,
        pt2fixed({
          x: a.x - changeX * 0.5,
          y: a.y - changeY * 0.5,
        }),
      );
    }
    case DIM_ACHOR.end:
    default:
      return moveVertex(
        path,
        startIndex,
        pt2fixed({
          x: a.x - changeX,
          y: a.y - changeY,
        }),
      );
  }
}
