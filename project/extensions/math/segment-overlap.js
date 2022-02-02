import { nearestPointOnLine } from './nearest-point-on-line.js';
import {
  realThreshold, ptDistSq, fuzzyEqualVec, withinRange,
} from './utils.js';


function segmentOverlap(seg1, seg2, epsilon = realThreshold) {
  const seg2ptA = nearestPointOnLine(seg1.a, seg1.b, seg2.a);
  const seg2ptB = nearestPointOnLine(seg1.a, seg1.b, seg2.b);

  const areColinear = ptDistSq(seg2ptA, seg2.a) < (epsilon * epsilon)
    && ptDistSq(seg2ptB, seg2.b) < (epsilon * epsilon);

  // segments are not colinear
  if (!areColinear) return null;

  // sort points from seg2 to be in same direction as seg1
  const vec1 = { x: seg1.b.x - seg1.a.x, y: seg1.b.y - seg1.a.y };
  const vec2 = { x: seg2.b.x - seg2.a.x, y: seg2.b.y - seg2.a.y };

  let a;
  let b;
  if (fuzzyEqualVec(vec1, vec2)) {
    a = seg2.a;
    b = seg2.b;
  } else {
    a = seg2.b;
    b = seg2.a;
  }

  const awr = withinRange(seg1.a, seg1.b, a);
  const bwr = withinRange(seg1.a, seg1.b, b);

  // segments are colinear but not overlapping
  if (!awr && !bwr) return null;

  // seg2 fully contained within seg1
  if (awr && bwr) {
    return [
      { a: seg1.a, b: a },
      { a, b },
      { a: b, b: seg1.b },
    ];
  }

  // seg2 overlaps point a of seg1
  if (bwr) {
    return [
      { a, b: seg1.a },
      { a: seg1.a, b },
      { a: b, b: seg1.b },
    ];
  }

  // seg2 overlaps point b of seg1
  return [
    { a: seg1.a, b: a },
    { a, b: seg1.b },
    { a: seg1.b, b },
  ];
}

export default segmentOverlap;
