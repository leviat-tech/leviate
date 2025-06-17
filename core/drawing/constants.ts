import { useEnum } from "../composables/useEnum";

export const FEATURE_TYPES = useEnum(['rectangular', 'circular', 'polygonal']);

export const PARALLEL_DIM_OFFSET = 0.15;

export enum DIM_ACHOR {
  start = 'start',
  centre = 'centre',
  end = 'end',
}
