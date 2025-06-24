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
