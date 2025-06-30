import { FEATURE_TYPES } from '../constants';
import { ShapeParams } from '../types/Drawings';
import { PERIMETER_DIM_TYPES } from "../constants";
import { Sketch } from "../types/Sketch"

export default {
  func(sketch: Sketch, params: ShapeParams) {
    let perimeter = sketch.user.perimeter(params.perimeter).name('perimeter');
  func(sketch: Sketch, params) {
    const { perimeter, features } = params;
    let perimeterSketch = sketch.user.perimeter(perimeter).name('perimeter');

    const segments: Sketch[] = [];
    const visibleElements: Sketch[] = [];

    if (perimeter.length > 2) {
      features.forEach(feature => {
        if (feature.shapeType === FEATURE_TYPES.POLYGONAL) {
          const vertexCount = feature.vertices.length;

          if (vertexCount <= 1) {
            return;
          }

          if (vertexCount === 2) {
            const [a, b] = feature.vertices;
            const segment = sketch.new.segment([a.x, a.y], [b.x, b.y]).style('shape');
            segments.push(segment);
            return;
          }
        }
      });
    }
    const featuresSketches = features.map(feature => {
      const featureSketch = sketch.user.feature(feature);

      if (feature.cutout) {
        try {
          const clone = featureSketch.clone();
          perimeterSketch = perimeterSketch.subtract(clone).style('shape');
        } catch (error) {
          console.error('Could not cutout feature from perimeter', { feature, perimeter });
        }
      }

      return featureSketch;
    });

    let previewOpening = null;

    // if (params.previewOpening) {
    //   previewOpening = sketch
    //     .rectangle([params.previewOpening.x - 0.1, params.previewOpening.y - 0.1], 0.2, 0.2)
    //     .style('shape');
    // }

    const perimeterDimFeature = params.dimType === PERIMETER_DIM_TYPES.PARALLEL ? 'edgeDimsParallel' : 'edgeDimsAxis';

    const perimeterDims = sketch.user[perimeterDimFeature]({
      vertices: params.perimeter,
      extents: perimeterSketch.extents,
      shapeType: 'perimeter',
      isInteractive: true,
      getOffset: params.getPerimeterDimOffset
    });

    // const perimeterNumbers = sketch.user.edgeNumbering({
    //   vertices: params.perimeter,
    // });

    // const perimeterCoordSys = sketch.user.edgeCoordSys({
    //   vertices: params.perimeter,
    // });

    // if (layers[MODEL_LAYERS.SLAB]) {
    visibleElements.push(perimeterSketch, ...segments);

    // if (layers[MODEL_LAYERS.DIMENSIONS]) {
    visibleElements.push(perimeterDims);
    // }

    visibleElements.push(previewOpening, ...featuresSketches);

    return sketch.add(...visibleElements);
  },
};
