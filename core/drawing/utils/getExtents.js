/**
 * Get edges from a path
 * @param path
 * @return {{ minX: number, maxX: number, minY: number, maxY: number }} extents
 */
export default function getExtents(path) {
  const xValues = path.map(p => p.x);
  const yValues = path.map(p => p.y);

  return {
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
    minY: Math.min(...yValues),
    maxY: Math.max(...yValues),
  };
}
