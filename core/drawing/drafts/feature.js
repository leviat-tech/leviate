import { FEATURE_TYPES } from '../constants.ts';

export default {
  func(sketch, feature) {
    let shape = null;

    const dataset = {
      type: feature.type,
      id: feature.id,
    };

    if (feature.shapeType === FEATURE_TYPES.circular) {
      shape = sketch
        .circle([feature.location.x, feature.location.y], feature.diameter * 0.5)
        .dataset(dataset);
    } else {
      const vertexCount = feature.vertices.length;
      if (vertexCount <= 1) return;
      if (vertexCount === 2) {
        const [a, b] = feature.vertices;
        shape = sketch.new.segment([a.x, a.y], [b.x, b.y]);
      } else {
        const polyfaceParams = [];

        feature.vertices.forEach(vertex => {
          polyfaceParams.push([vertex.x, vertex.y]);
          if (vertex.bulge && vertex.bulge !== 0) polyfaceParams.push(vertex.bulge || 0);
        });

        shape = sketch.polyface(...polyfaceParams).dataset(dataset);
      }
    }

    const opacity = feature.isDragging ? 0.5 : 1;

    return sketch.add(shape).style(feature.type || 'shape').style({ opacity });
  },
};
