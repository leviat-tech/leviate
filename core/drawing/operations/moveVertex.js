/**
 * Move a vertex on a path
 * @param path
 * @param index
 * @param newPosition
 * @return the updated path
 */
export default function moveVertex(path, index, newPosition) {
  return path.map((v, i) => {
    if (i !== index) return v;

    const next = index + 1 < path.length ? index + 1 : 0;
    const prev = index - 1 < 0 ? 0 : index - 1;
    if (v.bulge !== 0 || path[prev].bulge !== 0) {
      const nextVetex = v.bulge !== 0 ? path[next] : path[prev];
      const angle = 4 * Math.atan(v.bulge);
      const dist = Math.sqrt((nextVetex.x - v.x) ** 2 + (nextVetex.y - v.y) ** 2);
      const radius = (0.5 * dist) / Math.sin(angle / 2);
      const newDist = Math.sqrt(
        (nextVetex.x - newPosition.x) ** 2 + (nextVetex.y - newPosition.y) ** 2,
      );
      const newAngle = 2 * Math.asin((0.5 * newDist) / radius);
      newPosition.bulge = Math.tan(newAngle / 4);
    } else {
      newPosition.bulge = 0;
    }
    return newPosition;
  });
}
