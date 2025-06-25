import { Component } from "vue";
import { FEATURE_TYPES } from "../constants";

export interface Point {
  x: number;
  y: number;
}

export interface PointWithBulge {
  x: number;
  y: number;
  bulge: number;
}

export interface ToolRegistrationConfig {
  id: string;
  icon: Component;
  handler: () => unknown;
}

export type ShapeParams = {
  features: Array<Feature>;
  perimeter: Array<PointWithBulge>;
}

export interface Extents {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

export interface BaseFeature {
  id: string;
  type: string;
  style?: string;
  cutout?: boolean;
}

export interface CircularFeature extends BaseFeature {
  shapeType: typeof FEATURE_TYPES.CIRCULAR;
  location: Point;
  diameter: number;
}

export interface RectangularFeature extends BaseFeature {
  shapeType: typeof FEATURE_TYPES.RECTANGULAR;
  location: Point;
  width: number;
  height: number;
  vertices: PointWithBulge[];
}

export interface PolygonalFeature extends BaseFeature {
  shapeType: typeof FEATURE_TYPES.POLYGONAL;
  vertices: PointWithBulge[];
}

export type Feature = CircularFeature & { isDragging: boolean } | RectangularFeature & { isDragging: boolean } | PolygonalFeature & { isDragging: boolean };
