import { Vector } from '@crhio/vector';

function isClockwise(vec1, vec2) {
  return vec1.cross(vec2) < 0;
}

/**
 * round of a corner from a path
 * @param path
 * @param vertex - the vertex to round off
 */
export default function roundoffVertex(path, vertex, radius) {
  const index = path.slice().findIndex(v => v.x === vertex.x && v.y === vertex.y);
  const prev = index - 1 < 0 ? path.length - 1 : index - 1;
  const next = index + 1 > path.length - 1 ? 0 : index + 1;
  const prev2 = index - 2 < 0 ? path.length + (index - 2) : index - 2;
  const next2 = index + 2 > path.length - 1 ? index + 2 - path.length : index + 2;
  const a = path[prev];
  const b = path[index];
  const c = path[next];
  const bulge = path[index].bulge;
  const prevbulge = path[prev].bulge;
  const nextbulge = path[next].bulge;
  const prev2bulge = path[prev2].bulge;
  const v1 = Vector({ x: a.x, y: a.y });
  const v2 = Vector({ x: b.x, y: b.y });
  const v3 = Vector({ x: c.x, y: c.y });
  let length1 = v2.subtract(v1).magnitude();
  let length2 = v3.subtract(v2).magnitude();

  let vec1 = v2.subtract(v1).normalize();
  let vec2 = v3.subtract(v2).normalize();
  let isConcave = isClockwise(vec1, vec2);
  let alpha = (180 - vec2.angleBetweenDeg(vec1)) / 2;
  let beta = (90 - alpha) / 2; // = θ/4
  let newbulge = Math.tan((beta * Math.PI) / 180);
  let offset = radius / Math.tan((alpha * Math.PI) / 180);
  let vertex1 = v2.add(vec1.scale(-offset));
  let vertex2 = v2.add(vec2.scale(offset));
  let prevToDelete = prev;
  let nextToDelete = next;
  if (bulge !== 0 && prevbulge === 0 && nextbulge === 0) {
    const d = path[next2];
    const v4 = Vector({ x: d.x, y: d.y });
    length1 = v2.subtract(v1).magnitude();
    length2 = v4.subtract(v3).magnitude();
    vec1 = v2.subtract(v1).normalize();
    vec2 = v4.subtract(v3).normalize();
    const distBC = v3.subtract(v2).magnitude();
    isConcave = isClockwise(vec1, vec2);
    alpha = (180 - vec2.angleBetweenDeg(vec1)) / 2;
    beta = (90 - alpha) / 2; // = θ/4
    const curRadius = (0.5 * distBC) / Math.sin((beta * 2 * Math.PI) / 180);
    const curOffset = curRadius / Math.tan((alpha * Math.PI) / 180);
    const newOffset = radius / Math.tan((alpha * Math.PI) / 180);
    offset = newOffset - curOffset;
    vertex1 = v2.add(vec1.scale(-offset));
    vertex2 = v3.add(vec2.scale(offset));
    newbulge = radius === 0 ? 0 : Math.tan((beta * Math.PI) / 180);
    nextToDelete = next2;
    if (radius === 0) path.splice(index, 2, { x: vertex1.x, y: vertex1.y, bulge: newbulge });
    else
      path.splice(
        index,
        2,
        { x: vertex1.x, y: vertex1.y, bulge: isConcave ? -newbulge : newbulge },
        { x: vertex2.x, y: vertex2.y, bulge: 0 },
      );
  } else if (bulge === 0 && prevbulge !== 0 && prev2bulge === 0) {
    const d = path[prev2];
    const v4 = Vector({ x: d.x, y: d.y });
    length1 = v1.subtract(v4).magnitude();
    length2 = v3.subtract(v2).magnitude();
    vec1 = v1.subtract(v4).normalize();
    vec2 = v3.subtract(v2).normalize();
    const distAB = v2.subtract(v1).magnitude();
    isConcave = isClockwise(vec1, vec2);
    alpha = (180 - vec2.angleBetweenDeg(vec1)) / 2;
    beta = (90 - alpha) / 2; // = θ/4
    const curRadius = (0.5 * distAB) / Math.sin((beta * 2 * Math.PI) / 180);
    const curOffset = curRadius / Math.tan((alpha * Math.PI) / 180);
    const newOffset = radius / Math.tan((alpha * Math.PI) / 180);
    offset = newOffset - curOffset;
    vertex1 = v1.add(vec1.scale(-offset));
    vertex2 = v2.add(vec2.scale(offset));
    newbulge = radius === 0 ? 0 : Math.tan((beta * Math.PI) / 180);
    prevToDelete = prev2;
    if (radius === 0) path.splice(prev, 2, { x: vertex1.x, y: vertex1.y, bulge: newbulge });
    else
      path.splice(
        prev,
        2,
        { x: vertex1.x, y: vertex1.y, bulge: isConcave ? -newbulge : newbulge },
        { x: vertex2.x, y: vertex2.y, bulge: 0 },
      );
  } else {
    path.splice(
      index,
      1,
      { x: vertex1.x, y: vertex1.y, bulge: isConcave ? -newbulge : newbulge },
      { x: vertex2.x, y: vertex2.y, bulge: 0 },
    );
  }

  if (length1 < Math.abs(offset)) path.splice(prevToDelete, 1);
  if (length2 < Math.abs(offset)) path.splice(nextToDelete, 1);
  return path;
}
