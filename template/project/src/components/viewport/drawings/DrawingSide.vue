<template>
    <LvErrorBoundary :instance="entity">
      <DViewport
        data-cy="viewport_2d_side"
        :padding="0.5"
      >
        <DSectionShape
          :key="entity.id"
          :shape="shapeParams"
          :draft-config="draftConfig"
          origin
        />
      </DViewport>
    </LvErrorBoundary>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import draftConfig from '@/draft/draft.config';
import DViewport from '@crhio/leviate/drawing/components/DViewport.vue';
import LvErrorBoundary from '@crhio/leviate/components/LvErrorBoundary.vue';
import DSectionShape from '@crhio/leviate/drawing/components/DSectionShape.vue';
import { PERIMETER_DIM_TYPES, SHAPE_TYPES } from '@crhio/leviate/drawing/constants';
import {
  CircularFeature,
  PolygonalFeature,
  RectangularFeature
} from '@crhio/leviate/drawing/types';
import { cloneDeep } from 'lodash-es';
import useDrawing from '@crhio/leviate/drawing/composables/useDrawing';

const props = defineProps({
  entity: Object
});

const { state } = useDrawing();

// Define arbitrary features. In an app, these will likely be in models
const features: Ref<Array<CircularFeature | RectangularFeature | PolygonalFeature>> = ref([
  {
    id: 'openingId',
    type: 'opening',
    shapeType: SHAPE_TYPES.CIRCULAR,
    location: { x: 0.75, y: 1.25 },
    diameter: 0.5,
    cutout: false,
  },
  {
    id: 'recessId',
    type: 'recess',
    shapeType: SHAPE_TYPES.RECTANGULAR,
    location: { x: 1, y: 0 },
    vertices: [
      { x: 0, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 1 },
      { x: 0, y: 1 },
    ],
    thickness: 0.1,
    panelFace: 'near_end',
  },
  {
    id: 'upstandId',
    type: 'upstand',
    shapeType: SHAPE_TYPES.RECTANGULAR,
    location: { x: 0, y: 0 },
    vertices: [
      { x: 2, y: 1.1 },
      { x: 2.5, y: 1.1 },
      { x: 2.5, y: 1.5 },
      { x: 2, y: 1.5 },
    ],
    thickness: 0.1,
    panelFace: 'near_end',
  },
  {
    id: 'hollowId',
    type: 'hollow',
    shapeType: SHAPE_TYPES.RECTANGULAR,
    location: { x: 0, y: 0 },
    vertices: [
      { x: 2, y: 1.1 },
      { x: 2.5, y: 1.1 },
      { x: 2.5, y: 1.5 },
      { x: 2, y: 1.5 },
    ],
    thickness: 0.1,
    depthFromNearFace: 0.05,
  }
]);

const shapeParams = computed(() => {
  return {
    ...props.entity.$toJSON('*'),
    // An example of specifying offsets for edge dims
    getPerimeterDimOffset(edgeIndex: number) {
      return edgeIndex === 2 ? 2 : 1;
    },
    dimType: PERIMETER_DIM_TYPES.AXIS,
    features: props.entity.features || cloneDeep(features.value),
    cutSegment: state.sectionCut,
    viewDirection: 'top',
  };
});

</script>
