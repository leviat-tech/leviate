import { Feature, Sketch } from '../types';

export default {
  func(sketch: Sketch, params) {
    const { layers } = params;
    let perimeter = sketch.user.perimeter(params.perimeter).name('perimeter');

    const segments: Sketch[] = [];
    const visibleElements = [];

    if (params.perimeter.length > 2) {
      params.features.forEach((feature: Feature) => {

        if (feature.shapeType === 'polygonal') {
          const vertexCount = feature.vertices.length;
          if (vertexCount <= 1) return;
          if (vertexCount === 2) {
            const [a, b] = feature.vertices;
            const segment = sketch.new.segment([a.x, a.y], [b.x, b.y]).style('shape');
            segments.push(segment);
            return;
          }
        }

        // perimeter = perimeter.subtract(sketch.user.feature(feature)).style('shape');
      });
    }
    const features = params.features.map((feature: Feature) => {
      const featureSketch: Sketch = sketch.user.feature(feature);

      if (feature.cutout) {
        const clone = featureSketch.clone();
        perimeter = perimeter.subtract(clone).style('shape');
      }

      return featureSketch;
      // .style(
      //   params.invalidOpeningIds.some(id => id === feature.id) ? 'invalidOpening' : 'opening',
      // );
    });

    let previewOpening = null;

    // if (params.previewOpening) {
    //   previewOpening = sketch
    //     .rectangle([params.previewOpening.x - 0.1, params.previewOpening.y - 0.1], 0.2, 0.2)
    //     .style('shape');
    // }

    // const perimeterDims = sketch.user.edgeDimsParallel({
    //   vertices: params.perimeter,
    //   shapeType: 'perimeter',
    //   isInteractive: true,
    //   getOffset: params.getPerimeterDimOffset
    // });

    // const perimeterDims = sketch.user.edgeDimsAxis({
    //   vertices: params.perimeter,
    //   extents: perimeter.extents,
    //   shapeType: 'perimeter',
    //   isInteractive: true,
    //   getOffset: params.getPerimeterDimOffset
    // });

    // const perimeterNumbers = sketch.user.edgeNumbering({
    //   vertices: params.perimeter,
    // });

    // const perimeterCoordSys = sketch.user.edgeCoordSys({
    //   vertices: params.perimeter,
    // });

    // if (layers[MODEL_LAYERS.SLAB]) {
    visibleElements.push(perimeter, ...segments);

    // if (layers[MODEL_LAYERS.DIMENSIONS]) {
    // visibleElements.push(perimeterDims);
    // }

    visibleElements.push(previewOpening, ...features);

    return sketch.add(...visibleElements);
  },
};
