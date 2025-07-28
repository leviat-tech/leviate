import { Vector } from '@crhio/vector';
import Big from 'big.js';
import getExtents from './getExtents';

export const arrayMoveItem = (array, itemToMove, moveToIndex) => {
  if (array[moveToIndex] === itemToMove) return array;

  return array.reduce((items, item, i) => {
    if (item === itemToMove) return items;

    const isDragUp = array.indexOf(itemToMove) > moveToIndex;
    const sortedItems = isDragUp ? [...items, itemToMove, item] : [...items, item, itemToMove];
    return i === moveToIndex ? sortedItems : [...items, item];
  }, []);
};

export const arrayRemoveItem = (array, itemToRemove) => {
  return array.filter(item => item !== itemToRemove);
};

export const realThreshold = 1e-8;

export function withinRange(a, b, pt, epsilon = realThreshold) {
  const maxX = Math.max(a.x, b.x);
  const minX = Math.min(a.x, b.x);
  const maxY = Math.max(a.y, b.y);
  const minY = Math.min(a.y, b.y);

  return (
    pt.x > minX - epsilon && pt.x < maxX + epsilon && pt.y > minY - epsilon && pt.y < maxY + epsilon
  );
}

export function ptDistSq(pt1, pt2) {
  return (pt2.x - pt1.x) ** 2 + (pt2.y - pt1.y) ** 2;
}

export function nearestPointOnLine(a, b, p) {
  const ap = [p.x - a.x, p.y - a.y];
  const ab = [b.x - a.x, b.y - a.y];
  const ab2 = ab[0] ** 2 + ab[1] ** 2;
  const apDotAb = ap[0] * ab[0] + ap[1] * ab[1];
  const t = apDotAb / ab2;
  const pt = { x: a.x + ab[0] * t, y: a.y + ab[1] * t };
  return pt;
}

export function getNearestPointOnSegment(a, b, p) {
  const np = nearestPointOnLine(a, b, p);

  if (withinRange(a, b, np)) return np;

  const pts = [a, b];
  const distances = pts.map(point => ptDistSq(point, p));
  const index = distances.indexOf(Math.min(...distances));

  return pts[index];
}

export function getSegmentsFromVertexList(vertices, edgeNrFormatter = i => i + 1) {
  if (!vertices) {
    return [];
  }

  const last = vertices.length - 1;
  return vertices.map((vertex, index) => {
    const a = vertices[index];
    const b = index < last ? vertices[index + 1] : vertices[0];
    const bulge = vertices[index].bulge;
    const v1 = Vector({ x: a.x, y: a.y });
    const v2 = Vector({ x: b.x, y: b.y });
    const length = v2.subtract(v1).magnitude();
    const vec = length !== 0 ? v2.subtract(v1).normalize() : Vector({ x: 1, y: 0 });
    return { a, b, bulge, length, vec, edgeNr: edgeNrFormatter(index) };
  });
}

export function isPointOnSegement(segment, pt, precision) {
  const dist1 = Math.sqrt(ptDistSq(segment.a, pt));
  const dist2 = Math.sqrt(ptDistSq(pt, segment.b));
  let length = Math.sqrt(ptDistSq(segment.a, segment.b));
  let sumDist = Big(dist1).plus(dist2);

  length = Big(length).round(precision).toNumber();
  sumDist = sumDist.round(precision).toNumber();
  return almost_equal(sumDist, length);
}

export function getEdgeNrFromPoint(segments, pt, precision) {
  const segmentsWithPoint = segments
    .filter(s => isPointOnSegement(s, pt, precision))
    .map(({ edgeNr }) => edgeNr);

  return segmentsWithPoint.length > 0 ? segmentsWithPoint : -1;
}

export function roundNumber(value, step = 1.0) {
  // round(2.74, 0.1) = 2.7 round(2.74, 0.25) = 2.75 round(2.74, 0.5) = 2.5 round(2.74, 1.0) = 3.0
  const inv = 1.0 / step;
  return Math.round(value * inv) / inv;
}

export function pt2fixed(pt, step = 1) {
  // round pt.x pt.y to 1mm(step = 10), 5mm(step = 2), 10mm(step = 1)
  if (Number.isNaN(step) && step !== 1 && step !== 2 && step !== 4 && step !== 10) {
    return pt;
  }
  const x = roundNumber(pt.x * 100, 1 / step) / 100;
  const y = roundNumber(pt.y * 100, 1 / step) / 100;
  return { x, y };
}

// Arc related calculations below

export function getNearestPointOnArc(pointA, pointB, pointP, bulge) {
  // Calculate the midpoint of the chord AB
  const midpoint = { x: (pointA.x + pointB.x) / 2, y: (pointA.y + pointB.y) / 2 };

  // Calculate the distance between points A and B
  const chordLength = calculateDistance(pointA, pointB);

  // Calculate the sagitta and radius of the arc
  const sagitta = (chordLength * Math.abs(bulge)) / 2;
  const radius = (chordLength * chordLength) / (8 * sagitta) + sagitta / 2;

  // Calculate the perpendicular direction vector
  let perpVector = getPerpendicularVector(pointA, pointB);
  perpVector = normalizeVector(perpVector);

  // Determine the circle center based on the bulge sign
  const sqrtTerm = Math.sqrt(radius * radius - (chordLength / 2) * (chordLength / 2));
  const circleCenter =
    bulge > 0
      ? addVectors(midpoint, multiplyVector(perpVector, sqrtTerm))
      : subtractVectors(midpoint, multiplyVector(perpVector, sqrtTerm));

  // Calculate the angles for the arc
  const angleStart = Math.atan2(pointA.y - circleCenter.y, pointA.x - circleCenter.x);
  let angleEnd = Math.atan2(pointB.y - circleCenter.y, pointB.x - circleCenter.x);

  // Adjust the angular range based on the bulge sign
  if (bulge < 0 && angleEnd > angleStart) {
    angleEnd -= 2 * Math.PI;
  } else if (bulge > 0 && angleEnd < angleStart) {
    angleEnd += 2 * Math.PI;
  }

  // Function to compute the point on the arc for a given angle
  function pointOnArc(angle) {
    return {
      x: circleCenter.x + radius * Math.cos(angle),
      y: circleCenter.y + radius * Math.sin(angle),
    };
  }

  // Iterate over small steps to find the closest point on the arc
  let closestPoint = pointOnArc(angleStart);
  let minDistance = calculateDistance(closestPoint, pointP);
  const steps = 1000;
  const step = (angleEnd - angleStart) / steps; // Divide the angle range into steps for accuracy

  for (let i = 0; i <= steps; i += 1) {
    let angle = angleStart + i * step;
    // Normalize the angle within [0, 2 * Math.PI]
    if (bulge < 0 && angle > 2 * Math.PI) angle -= 2 * Math.PI;
    if (bulge > 0 && angle < 0) angle += 2 * Math.PI;

    const point = pointOnArc(angle);
    const distance = calculateDistance(point, pointP);
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  }

  return closestPoint;
}

export function calculateDistance(pointA, pointB) {
  return Math.sqrt(
    (pointB.x - pointA.x) * (pointB.x - pointA.x) + (pointB.y - pointA.y) * (pointB.y - pointA.y),
  );
}

export function recalculateBulge(newVertex, segment) {
  // updated segments with a new vertex 'C': A -- C -- B
  const { a: pointA, b: pointB } = segment;
  // calculate bulge for a new vertex 'C'
  const angleAB = 4 * Math.atan(pointA.bulge);
  const distAB = calculateDistance(pointA, pointB);
  const radius = (0.5 * distAB) / Math.sin(angleAB / 2);
  const distCB = calculateDistance(pointB, newVertex);
  const angleCB = 2 * Math.asin((0.5 * distCB) / radius);
  const newVertexBulge = Math.tan(angleCB / 4);

  // re-calculate bulge for initial vertex with bulge 'A'
  const distAC = calculateDistance(newVertex, pointA);
  const angleAC = 2 * Math.asin((0.5 * distAC) / radius);
  const startPointBulge = Math.tan(angleAC / 4);

  return { newVertexBulge, startPointBulge };
}

export function getPerpendicularVector(pointA, pointB) {
  return { x: -(pointB.y - pointA.y), y: pointB.x - pointA.x };
}

export function normalizeVector(vector) {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  return { x: vector.x / length, y: vector.y / length };
}

export function addVectors(vector1, vector2) {
  return {
    x: Big(vector1.x).plus(vector2.x).toNumber(),
    y: Big(vector1.y).plus(vector2.y).toNumber(),
  };
}

export function subtractVectors(vector1, vector2) {
  return {
    x: Big(vector1.x).minus(vector2.x).toNumber(),
    y: Big(vector1.y).minus(vector2.y).toNumber(),
  };
}

export function multiplyVector(vector, scalar) {
  return { x: vector.x * scalar, y: vector.y * scalar };
}

export function getSegmentRadiusFromVertexList(vertices) {
  return vertices.map((vertex, index) => {
    const bulge = vertex.bulge;
    if (bulge === 0) return 0;

    const beta = Math.atan(bulge); // = θ/4
    const next = index + 1 > vertices.length - 1 ? 0 : index + 1;
    const nextVertex = vertices[next];
    const dist = calculateDistance(
      { x: nextVertex.x, y: nextVertex.y },
      { x: vertex.x, y: vertex.y },
    );
    return Math.abs((0.5 * dist) / Math.sin(beta * 2));
  });
}

export function almost_equal(a, b, absoluteError = 2.2204460492503131e-16, relativeError = 1.1920929e-7) {
  const d = Math.abs(a - b);
  if (d <= absoluteError) return true;

  if (d <= relativeError * Math.min(Math.abs(a), Math.abs(b))) return true;

  return a === b;
}

export function polygonAreaSigned(pts) {
  let area = 0;
  for (let i = 0; i < pts.length; i += 1) {
    const j = (i + 1) % pts.length;
    const [x1, y1] = [pts[i].x, pts[i].y];
    const [x2, y2] = [pts[j].x, pts[j].y];
    area += x1 * y2 - x2 * y1;
  }
  return area / 2.0;
}

export function orientation(vertices) {
  if (vertices.length < 3) {
    return 0;
  }
  const val = polygonAreaSigned(vertices);
  if (almost_equal(val, 0)) {
    return 0;
  } // 'colinear'
  return val > 0 ? 1 : -1; // 'counterclockwise' : 'clockwise'
}

export function setToCounterClockwise(vertices) {
  if (orientation(vertices) >= 0) return vertices;

  const originalVertices = vertices.slice().reverse();
  const firstVetex = vertices.shift();
  vertices.reverse();
  vertices.unshift(firstVetex);

  return vertices.map(({ x, y }, i) => {
    return { x, y, bulge: -originalVertices[i].bulge };
  });
}

function turnDirection(a, b, c) {
  // > 0 is clockwise
  // < 0 is anticlockwise
  return (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
}

export function intersects(lineA, lineB) {
  // if both turns from a to b1 and b2 are different directions and both turns from b to a1 and a2 are different then the lines cross.
  if (turnDirection(lineA.a, lineA.b, lineB.a) * turnDirection(lineA.a, lineA.b, lineB.b) >= 0)
    return false;
  if (turnDirection(lineB.a, lineB.b, lineA.a) * turnDirection(lineB.a, lineB.b, lineA.b) >= 0)
    return false;
  // TODO: intersection of line-arc or arc-arc segments
  return true;
}

export function validateSimplePolygon(edges) {
  return edges.some((edgeA, index) => {
    const remainingEdges = edges.slice(index + 2);
    return remainingEdges.some(edgeB => intersects(edgeA, edgeB));
  });
}

function isSimplePolygonTest(vertices, context) {
  const edges = getSegmentsFromVertexList(vertices);
  const test = validateSimplePolygon(edges);
  if (!test) return true;
  const location = context.path.split('.')[0];
  return context.createError({ message: `${location} has edges that cross` });
}

export const isSimplePolygon = {
  name: 'isSimplePolygon',
  test: isSimplePolygonTest,
  exclusive: true,
};

export function calculateCentroid(vertices) {
  const n = vertices.length;
  const centroid = vertices.reduce(
    (acc, vertex) => {
      acc.x += vertex.x;
      acc.y += vertex.y;
      return acc;
    },
    { x: 0, y: 0 },
  );

  centroid.x /= n;
  centroid.y /= n;

  return centroid;
}

export function findSegmentIndexByTwoPoints(p1, p2, vertices) {
  return getSegmentsFromVertexList(vertices).findIndex(({ a, b }) => {
    return a.x === p1.x && a.y === p1.y && b.x === p2.x && b.y === p2.y;
  });
}

export function findVertexIndex(vertices, vertex) {
  return vertices.findIndex(point => {
    return vertex.x === point.x && vertex.y === point.y;
  });
}

export function moveVectorInDirection(vector, directionVector, newLength) {
  return [
    {
      x: vector[0].x + newLength * directionVector.x,
      y: vector[0].y + newLength * directionVector.y,
    },
    {
      x: vector[1].x + newLength * directionVector.x,
      y: vector[1].y + newLength * directionVector.y,
    },
  ];
}

export function pointOnSegement(a, b, pt) {
  const length = Math.sqrt(ptDistSq(a, b));
  const dist1 = Math.sqrt(ptDistSq(a, pt));
  const dist2 = Math.sqrt(ptDistSq(pt, b));
  return almost_equal(dist1 + dist2, length);
}

export function pointInPolygonInclusiveEdges(vertices, vertex) {
  let odd = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; i += 1) {
    if (pointOnSegement(vertices[i], vertices[j], vertex)) {
      odd = true;
      break;
    }
    if (
      vertices[i].y > vertex.y !== vertices[j].y > vertex.y &&
      vertex.x <
        ((vertices[j].x - vertices[i].x) * (vertex.y - vertices[i].y)) /
          (vertices[j].y - vertices[i].y) +
          vertices[i].x
    ) {
      odd = !odd;
    }
    j = i;
  }
  return odd;
}

export function pointInPolygonExclusiveEdges(vertices, vertex) {
  let odd = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; i += 1) {
    if (
      vertices[i].y >= vertex.y !== vertices[j].y >= vertex.y &&
      vertex.x <=
        ((vertices[j].x - vertices[i].x) * (vertex.y - vertices[i].y)) /
          (vertices[j].y - vertices[i].y) +
          vertices[i].x
    ) {
      odd = !odd;
    }
    if (pointOnSegement(vertices[i], vertices[j], vertex)) {
      odd = false;
      break;
    }
    j = i;
  }
  return odd;
}
// convert distances from the vector's 'start' to actual coordinates
export function getCoordinatesFromVecDistance(start, end, distances) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const { x: ux, y: uy } = normalizeVector({ x: dx, y: dy });

  return distances.map(distance => ({
    x: start.x + distance * ux,
    y: start.y + distance * uy,
  }));
}

export function translateVertices(vertices, translateBy) {
    return vertices.map((vertex) => ({
      ...addVectors(vertex, translateBy),
      bulge: vertex.bulge,
    }));
}

export function getBoundingBox(vertices, location) {
  const { xmin, xmax, ymin, ymax } = getExtents(vertices);

  const width = Big(xmax).minus(xmin).toNumber();
  const height = Big(ymax).minus(ymin).toNumber();

  return {
    width,
    height,
  }
}
