export const PERIMETER_DIM_OFFSET = 0.15;
export const AXIS_DIM_OFFSET = 0.2;

export const SHAPE_TYPES = {
  RECTANGULAR: 'rectangular',
  CIRCULAR: 'circular',
  POLYGONAL: 'polygonal',
} as const;

export type AvailableShapeTypes = typeof SHAPE_TYPES[keyof typeof SHAPE_TYPES];

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
} as const;

export type AvailableToolbarOptions = typeof TOOLBAR_OPTIONS[keyof typeof TOOLBAR_OPTIONS];

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

