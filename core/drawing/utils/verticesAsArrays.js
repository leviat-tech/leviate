export default function verticesAsArrays(vertices) {
  return vertices.map(v => [v.x, v.y, v.bulge]);
}
