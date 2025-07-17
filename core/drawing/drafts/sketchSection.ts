import { Sketch } from '@crhio/jsdraft';
import { Point } from '../types';

function sketchSection(elevationsketch: Sketch, segment: {a: Point, b: Point}, offset: number, thickness: number) {
  const slice = elevationsketch.slice([[segment.a.x, segment.a.y], [segment.b.x, segment.b.y]]);

  const segments = slice.entities;
  if(segments.length === 0)
    return null;

  if (Math.abs(segment.a.y - segment.b.y) < 0.001) {
    let result = new Sketch();
    segments.forEach((s) => {
      result = result.rectangle([s.ps.x, offset], [s.pe.x, offset + thickness]);
    });
    return result;
  }
  let result = new Sketch();
  segments.forEach((s) => {
    result = result.rectangle([offset, s.ps.y], [offset + thickness, s.pe.y]);
  });

  return result;
}
export default sketchSection;
