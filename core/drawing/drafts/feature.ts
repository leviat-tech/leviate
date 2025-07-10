import { SHAPE_TYPES } from '../constants';
import { CircularFeature, PolygonalFeature, RectangularFeature } from "../types/Drawings";
import { Sketch, SketchPoint } from '../types/Sketch'

export default {
  func(sketch: Sketch, feature: RectangularFeature | CircularFeature | PolygonalFeature): Sketch {
    let shape = null;

    const dataset = {
      type: feature.type,
      id: feature.id,
    };

    switch (feature.shapeType) {
      case SHAPE_TYPES.CIRCULAR: {
        const { diameter, location } = feature;

        if (diameter <= 0) {
          return sketch;
        }

        shape = sketch.circle([location.x, location.y], diameter / 2);
        break;
      }

      case SHAPE_TYPES.POLYGONAL: {
        const { vertices } = feature;

        if (vertices.length <= 1) {
          return sketch
        }

        const adjustedVertices: SketchPoint[] = vertices.map(({ x, y }) => [x, y]);

        if (vertices.length === 2) {
          return sketch.segment(adjustedVertices[0], adjustedVertices[1]);
        }


        shape = sketch.polyface(...adjustedVertices);
        break;
      }
      case SHAPE_TYPES.RECTANGULAR: {
        const { vertices, location } = feature;

        if (vertices.length < 3) {
          return sketch;
        }

        const adjustedVertices: SketchPoint[] = vertices.map(({ x, y }) => [
          x + 0, //location.x,
          y + 0, //location.y,
        ]);

        shape = sketch.polyface(...adjustedVertices);
        break;
      }
    }

    const opacity = feature.isDragging ? 1 : 1;

    return sketch.add(shape).dataset(dataset).style(feature.style || feature.type || 'shape').style({ opacity });
  },
};
