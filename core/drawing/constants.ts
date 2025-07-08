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

export const TOOLBAR_OPTIONS = {
  POINTER: 'pointer',

  ROUND_OFF: 'round_off',
  ADD_VERTEX: 'add_vertex',
  NEW_POLYGON: 'new_polygon',
  DELETE_VERTEX: 'delete_vertex',

  MIRROR_GEOMETRY: 'mirror_geometry',

  RECT_OPENING: 'rect_opening',
  CIRCLE_OPENING: 'circle_opening',
  POLYGON_OPENING: 'polygon_opening',

  RECT_RECESS: 'rect_recess',
  CIRCLE_RECESS: 'circle_recess',
  POLYGON_RECESS: 'polygon_recess',
} as const;

export type AvailableToolbarOptions = typeof TOOLBAR_OPTIONS[keyof typeof TOOLBAR_OPTIONS]

export const PERIMETER_DIM_TYPES = {
  AXIS: 'axis',
  PARALLEL: 'parallel',
}

export const DEFAULT_TOOLS = [
  TOOLBAR_OPTIONS.POINTER,
  TOOLBAR_OPTIONS.ADD_VERTEX,
  TOOLBAR_OPTIONS.DELETE_VERTEX,
];

export const DIMENSION_TYPES = {
  AXIS: 'dimension:axis',
  PERIMETER: 'dimension:perimeter',
  FEATURE: 'dimension:feature',
}

