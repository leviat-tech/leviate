export const PERIMETER_DIM_OFFSET = 0.15;
export const AXIS_DIM_OFFSET = 0.2;

export const FEATURE_TYPES = {
  RECTANGULAR: 'rectangular',
  CIRCULAR: 'circular',
  POLYGONAL: 'polygonal',
} as const;

export enum DIM_ANCHOR {
  start = 'start',
  centre = 'centre',
  end = 'end',
}

export const PERIMETER_DIM_TYPES = {
  AXIS: 'axis',
  PARALLEL: 'parallel',
}

export const DEFAULT_TOOLS = [
  'pointer',
  'new_polygon',
  'add_vertex',
  'delete_vertex',
  'round_off',
  'mirror_geometry',
  // 'opening_select',
  'rect_opening',
  'circle_opening',
  'polygon_opening',
];

export const DIMENSION_TYPES = {
  WIDTH: 'dimension:width',
  HEIGHT: 'dimension:height',
  AXIS: 'dimension:axis',
  PERIMETER: 'dimension:perimeter',
  FEATURE: 'dimension:feature',
}

