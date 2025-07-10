import { Component } from "vue";
import { SHAPE_TYPES, PERIMETER_DIM_TYPES } from "../constants";
import { Extents, Sketch } from "./Sketch";

export interface Point {
  x: number;
  y: number;
}

export interface PointWithBulge {
  x: number;
  y: number;
  bulge: number;
}

export interface ToolItem {
  id: string;
  icon: Component;
  handler?: (toolId: string) => unknown;
  children?: ToolItem[];
  params?: any;
}

export type ShapeParams = {
  features: Feature[];
  extents?: Extents;
  perimeter: Array<PointWithBulge>;
  dimType: typeof PERIMETER_DIM_TYPES[keyof typeof PERIMETER_DIM_TYPES];
  getPerimeterDimOffset?: (edgeIndex: number) => number;
}

export interface BaseFeature {
  id: string;
  type: string;
  style?: string;
  cutout?: boolean;
  isDragging: boolean;
}

export interface CircularFeature extends BaseFeature {
  shapeType: typeof SHAPE_TYPES.CIRCULAR;
  location: Point;
  diameter: number;
}

export interface RectangularFeature extends BaseFeature {
  shapeType: typeof SHAPE_TYPES.RECTANGULAR;
  location: Point;
  width: number;
  height: number;
  vertices: PointWithBulge[];
}

export interface PolygonalFeature extends BaseFeature {
  shapeType: typeof SHAPE_TYPES.POLYGONAL;
  vertices: PointWithBulge[];
}

export type Feature = CircularFeature | RectangularFeature | PolygonalFeature;

export interface ShapeSketch extends Sketch {
  user: {
    shape: (params: ShapeParams) => Sketch;
    perimeter: (params: Array<PointWithBulge>) => Sketch;
    feature: (params: Feature) => Sketch;
    edgeDimsParallel: (params: any) => Sketch;
    edgeDimsAxis: (params: any) => Sketch;
    [key: string]: ((params: any) => Sketch)
  }
}
