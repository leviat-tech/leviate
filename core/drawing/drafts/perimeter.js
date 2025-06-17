export default {
  func(sketch, perimeter) {
    const polyfaceParams = [];

    perimeter.forEach(vertex => {
      polyfaceParams.push([vertex.x, vertex.y]);
      if (vertex.bulge !== 0) polyfaceParams.push(vertex.bulge);
    });

    let shape = null;

    if (perimeter.length >= 2) {
      shape = sketch.polyface(...polyfaceParams).name('perimeter');
    }

    return sketch.add(shape).style('shape');
  },
};
