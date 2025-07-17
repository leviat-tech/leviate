/**
 * Get edges from a path
 * @param path
 * @return {{ xmin: number, xmax: number, ymin: number, ymax: number }} extents
 */
export default function getExtents(path) {
  const xValues = path.map(p => p.x);
  const yValues = path.map(p => p.y);

  return {
    xmin: Math.min(...xValues),
    xmax: Math.max(...xValues),
    ymin: Math.min(...yValues),
    ymax: Math.max(...yValues),
  };
}
