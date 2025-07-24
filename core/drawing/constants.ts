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

export const ANCHOR_POINTS = {
  LEFT: 'l',
  RIGHT: 'r',
  TOP: 't',
  BOTTOM: 'b',
  TOP_LEFT: 'tl',
  TOP_RIGHT: 'tr',
  BOTTOM_LEFT: 'bl',
  BOTTOM_RIGHT: 'br',
  CENTER: 'c',
}

export const cursorClassMap = {
  [ANCHOR_POINTS.LEFT]: '!cursor-ew-resize',
  [ANCHOR_POINTS.RIGHT]: '!cursor-ew-resize',
  [ANCHOR_POINTS.TOP]: '!cursor-ns-resize',
  [ANCHOR_POINTS.BOTTOM]: '!cursor-ns-resize',
  [ANCHOR_POINTS.TOP_LEFT]: '!cursor-nwse-resize',
  [ANCHOR_POINTS.TOP_RIGHT]: '!cursor-nesw-resize',
  [ANCHOR_POINTS.BOTTOM_LEFT]: '!cursor-nesw-resize',
  [ANCHOR_POINTS.BOTTOM_RIGHT]: '!cursor-nwse-resize',
}

export const RELATIONS = {
  INTERSECTION: 'intersection',
  A_CONTAINS_B: 'A contains B',
  B_CONTAINS_A: 'B contains A',
  A_COVERS_B: 'A covers B',
}

export type AvailableAnchorPoints = typeof ANCHOR_POINTS[keyof typeof ANCHOR_POINTS];

