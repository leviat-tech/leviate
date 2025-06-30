import { PointWithBulge } from '../types/Drawings';
import {Sketch, SketchPoint} from '../types/Sketch'

export default {
  func(sketch: Sketch, perimeter: Array<PointWithBulge>) {
    let shape = null;

    if (perimeter?.length >= 2) {
      const polyfaceParams: Array<SketchPoint | number> = [];

      perimeter?.forEach(vertex => {
        polyfaceParams.push([vertex.x, vertex.y]);
        if (vertex.bulge !== 0) polyfaceParams.push(vertex.bulge);
      });

      shape = sketch.polyface(...polyfaceParams).name('perimeter');
      return sketch.add(shape).style('shape');
    }

    return sketch;
  },
};
