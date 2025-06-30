export const PARALLEL_DIM_OFFSET = 0.15;

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
  NEW_POLYGON: 'new_polygon',
  ADD_VERTEX: 'add_vertex',
  DELETE_VERTEX: 'delete_vertex',
  ROUND_OFF: 'round_off',
  MIRROR_GEOMETRY: 'mirror_geometry',
  POINT_BEARING: 'point_bearing',
  EDGE_BEARING: 'edge_bearing',
  RANGE_FOR_CONNECTORS: 'range_for_connectors',
  POINT_LOADS: 'point_loads',
  LINE_LOADS: 'line_loads',
  AREA_LOADS: 'area_loads',
  RECT_OPENING: 'rect_opening',
  CIRCLE_OPENING: 'circle_opening',
  POLYGON_OPENING: 'polygon_opening',
} as const;

export type AvailableToolbarOptions = typeof TOOLBAR_OPTIONS[keyof typeof TOOLBAR_OPTIONS]

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
