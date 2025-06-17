/**
 * Add a vertex to a path
 * @param path
 * @param newVertex
 * @param [afterVertex] - the reference vertex to add the new vertex after
 * @return the updated path containing the added vertex
 */
export default function addVertex(path, newVertex, afterVertex) {
  const isDuplicatedPoint = path.some(v => {
    return v.x === newVertex.x && v.y === newVertex.y && v.bulge === newVertex.bulge;
  });

  if (isDuplicatedPoint) {
    return path;
  }

  if (!afterVertex) {
    return [...path, newVertex];
  }

  const afterIndex = path.findIndex(v => {
    return v.x === afterVertex.x && v.y === afterVertex.y;
  });

  return [...path.slice(0, afterIndex + 1), newVertex, ...path.slice(afterIndex + 1)];
}
