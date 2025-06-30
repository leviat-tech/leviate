/**
 * Add a vertex to a path
 * @param path
 * @param oldVertex - the vertex to update
 * @param newVertices - new vertices to add
 * @return the updated path containing the added vertex
 */
export default function updateVertex(path, oldVertex, ...newVertices) {
  const index = path.findIndex(v => v.x === oldVertex.x && v.y === oldVertex.y);
  return path.toSpliced(index, 1, ...newVertices);
}
