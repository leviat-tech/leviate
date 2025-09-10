import useDrawing, { getShapesRelations } from './composables/useDrawing';
import useDraggablePoint from './composables/useDraggablePoint';

import DShape from './components/DShape.vue';
import DOrigin from './components/DOrigin.vue';
import DToolbar from './components/toolbar/DToolbar.vue';
import DVertices from './components/DVertices.vue';
import DViewport from './components/DViewport.vue';
import DGridlines from './components/DGridlines.vue';
import DHoverText from './components/DHoverText.vue';
import DNewVertex from './components/DNewVertex.vue';
import DNewGeometry from './components/DNewGeometry.vue';
import DEditableShape from './components/DEditableShape.vue';
import DDraggablePoint from './components/DDraggablePoint.vue';
import DDraggableSketch from './components/DDraggableSketch.vue';
import DSectionLine from './components/DSectionLine.vue';
import DFeatureCirc from './components/DFeatureCirc.vue';
import DFeatureRect from './components/DFeatureRect.vue';
import DFeaturePoly from './components/DFeaturePoly.vue';

import type {
  Point,
  Feature,
  ShapeParams,
  BaseFeature,
  PointWithBulge,
  CircularFeature,
  PolygonalFeature,
  RectangularFeature,
} from './types/Drawings'

import featureDraft from './drafts/feature'
import perimeterDraft from './drafts/perimeter';

import type { Sketch, StyleProp, SketchPoint } from './types/Sketch'

import { SHAPE_TYPES, RELATIONS, TOOLBAR_OPTIONS } from './constants'

export {
  DOrigin,
  DShape,
  DToolbar,
  DVertices,
  DViewport,
  DGridlines,
  DHoverText,
  DNewVertex,
  DNewGeometry,
  DEditableShape,
  DDraggablePoint,
  DDraggableSketch,
  DSectionLine,
  DFeatureCirc,
  DFeatureRect,
  DFeaturePoly,

  useDrawing,
  useDraggablePoint,

  featureDraft,
  perimeterDraft,

  getShapesRelations,

  RELATIONS,
  SHAPE_TYPES,
  TOOLBAR_OPTIONS,

  Point,
  Sketch,
  Feature,
  StyleProp,
  SketchPoint,
  ShapeParams,
  BaseFeature,
  PointWithBulge,
  CircularFeature,
  PolygonalFeature,
  RectangularFeature,
};
