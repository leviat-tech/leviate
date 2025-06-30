import { Sketch } from '@crhio/jsdraft';
import perimeterDraft from '../drafts/perimeter';
import openingDraft from '../drafts/opening';

export function validateOpeningInside(shape) {
  const invalidOpeningIds = [];
  // check openings are located entirely within the slab
  const slab = perimeterDraft.func(new Sketch(), shape.value.perimeter);
  shape.value.openings.forEach(opening => {
    const o = openingDraft.func(new Sketch(), opening);
    if (!o || !o.shape) return; // polygon opening added in form
    if (!slab.shape.contains(o.shape)) {
      invalidOpeningIds.push(opening.id);
    }
  });

  return invalidOpeningIds;
}

export function validateOpeningsIntersection(shape) {
  const invalidOpeningIds = [];
  // check collision with each other
  const openingsCopy = shape.value.openings.slice();
  openingsCopy.forEach((openingA, index) => {
    const sketchA = openingDraft.func(new Sketch(), openingA);
    if (!sketchA || !sketchA.shape) return;
    const remainingOpenings = openingsCopy.slice(index + 1);
    remainingOpenings.forEach(openingB => {
      const sketchB = openingDraft.func(new Sketch(), openingB);
      if (sketchB && sketchB.shape) {
        if (
          sketchA.shape.intersect(sketchB.shape).length > 0 ||
          sketchA.shape.contains(sketchB.shape) ||
          sketchB.shape.contains(sketchA.shape)
        ) {
          invalidOpeningIds.push(openingA.id);
          invalidOpeningIds.push(openingB.id);
        }
      }
    });
  });

  return invalidOpeningIds;
}

export function validateOpenings(shape) {
  // check collision with slab
  const outsideIds = validateOpeningInside(shape);

  // check collision with each other
  const intersetIds = validateOpeningsIntersection(shape);

  return outsideIds.concat(intersetIds);
}

export function getShapeArea(shape) {
  const slab = perimeterDraft.func(new Sketch(), shape.value.perimeter);
  let area = slab.area();

  shape.value.openings.forEach(opening => {
    const o = openingDraft.func(new Sketch(), opening);
    if (o && o.shape) area -= o.area();
  });

  return area;
}
