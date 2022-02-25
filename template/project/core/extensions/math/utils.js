export const realThreshold = 1e-8;

export function ptDistSq(pt1, pt2) {
  return (pt2.x - pt1.x) ** 2 + (pt2.y - pt1.y) ** 2;
}

export function ptDist(pt1, pt2) {
  return Math.sqrt(ptDistSq(pt1, pt2));
}

export function fuzzyEqual(x, y, epsilon = realThreshold) {
  return Math.abs(x - y) < epsilon;
}

export function fuzzyLessThan(x, y, epsilon = realThreshold) {
  return x < (y - epsilon);
}

export function fuzzyGreaterThan(x, y, epsilon = realThreshold) {
  return x > (y + epsilon);
}

export function fuzzyEqualVec(a, b, epsilon = realThreshold) {
  return fuzzyEqual(a.x, b.x, epsilon) && fuzzyEqual(a.y, b.y, epsilon);
}

export function withinRange(a, b, pt, epsilon = realThreshold) {
  const maxX = Math.max(a.x, b.x);
  const minX = Math.min(a.x, b.x);
  const maxY = Math.max(a.y, b.y);
  const minY = Math.min(a.y, b.y);

  return pt.x > (minX - epsilon)
    && pt.x < (maxX + epsilon)
    && pt.y > (minY - epsilon)
    && pt.y < (maxY + epsilon);
}

export function prev(arr, index) {
  return arr[(index + arr.length - 1) % arr.length];
}

export function next(arr, index) {
  return arr[(index + 1) % arr.length];
}

export function fix3(x, n = 3) {
  return Number.parseFloat(x.toFixed(n));
}

function roundNumber(value, step = 1.0) {
  // round(2.74, 0.1) = 2.7 round(2.74, 0.25) = 2.75 round(2.74, 0.5) = 2.5 round(2.74, 1.0) = 3.0
  const inv = 1.0 / step;
  return Math.round(value * inv) / inv;
}

export function pt2fixed(pt, step = 1) {
  // round pt.x pt.y to 1mm(step = 10), 5mm(step = 2), 10mm(step = 1)
  if (Number.isNaN(step) && step !== 1 && step !== 2 && step !== 4 && step !== 10) { return pt; }
  const x = roundNumber(pt.x * 100, 1 / step) / 100;
  const y = roundNumber(pt.y * 100, 1 / step) / 100;
  return { x, y };
}
