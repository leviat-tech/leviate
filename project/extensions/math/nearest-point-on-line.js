import { ptDistSq, withinRange } from './utils.js';


function nearestPointOnLine(a, b, p) {
  const ap = [p.x - a.x, p.y - a.y];
  const ab = [b.x - a.x, b.y - a.y];
  const ab2 = ab[0] ** 2 + ab[1] ** 2;
  const apDotAb = ap[0] * ab[0] + ap[1] * ab[1];
  const t = apDotAb / ab2;
  const pt = { x: a.x + ab[0] * t, y: a.y + ab[1] * t };
  return pt;
}

function nearestPointOnSegment(a, b, p) {
  const np = nearestPointOnLine(a, b, p);

  if (withinRange(a, b, np)) return np;

  const pts = [a, b];
  const distances = pts.map((point) => ptDistSq(point, p));
  const index = distances.indexOf(Math.min(...distances));

  return pts[index];
}

export { nearestPointOnLine, nearestPointOnSegment };
