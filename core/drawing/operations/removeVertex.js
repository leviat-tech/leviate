/**
 * Remove a vertex from a path
 * @param path
 * @param vertex - the vertex to remove
 */
export default function removeVertex(path, vertex) {
  const index = path.slice().findIndex(v => v.x === vertex.x && v.y === vertex.y);
  const prev = index - 1 < 0 ? path.length - 1 : index - 1;
  if (path[prev].bulge !== 0) path[prev].bulge = 0;
  path.splice(index, 1);
  return path;
}
