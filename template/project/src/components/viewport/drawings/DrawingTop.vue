<template>
  <LvErrorBoundary :instance="entity">
    <DViewport
      current-tool="select"
      data-cy="viewport_2d"
      :padding="0.5"
      show-grid
    >
      <DEditableShape
        :key="entity.id"
        :shape="shapeParams"
        :draft-config="draftConfig"
        @update="onUpdate"
        origin
      />
      <!--      @add:opening="addOpening"-->
      <!--      @update:opening="updateOpening"-->
      <!--      @update:active-opening="scrollToActiveItem"-->
      <!--      @delete:active-opening="id => deleteFeature(id, OpeningModel)"-->
      <!--      @validate:openings="validateOpenings"-->
    </DViewport>

    <DToolbar
      :items="toolbarItems"
      :formatter="tool => $l(`tooltip_${tool}`)"
    />
  </LvErrorBoundary>
</template>

<script setup lang="ts">
import AreaLoads from '@/assets/area_loads.svg';
import { computed, Ref, ref } from 'vue';
import { transact } from '@crhio/leviate';
import draftConfig from '@/draft/draft.config';
import DViewport from '@crhio/leviate/drawing/components/DViewport.vue';
import LvErrorBoundary from '@crhio/leviate/components/LvErrorBoundary.vue';
import DToolbar from '@crhio/leviate/drawing/components/DToolbar.vue';
import DEditableShape from '@crhio/leviate/drawing/components/DEditableShape.vue';
import { FEATURE_TYPES, PERIMETER_DIM_TYPES } from '@crhio/leviate/drawing/constants';
import {
  CircularFeature,
  PolygonalFeature,
  RectangularFeature
} from "@crhio/leviate/drawing/types";

const props = defineProps({
  entity: Object
});

// Define arbitrary features. In an app, these will likely be in models
const features: Ref<Array<CircularFeature | RectangularFeature | PolygonalFeature>> = ref([
  {
    id: 'openingId',
    type: 'opening',
    shapeType: FEATURE_TYPES.CIRCULAR,
    location: { x: 0.75, y: 1.25 },
    diameter: 0.5,
    cutout: true,
    // style: 'recessBase'
  },
  {
    id: 'recessId',
    type: 'recess',
    shapeType: FEATURE_TYPES.RECTANGULAR,
    location: { x: 0, y: 0 },
    vertices: [
      { x: 0, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 1 },
      { x: 0, y: 1 },
    ],
  },
  {
    id: 'upstandId',
    type: 'upstand',
    cutout: true,
    shapeType: FEATURE_TYPES.RECTANGULAR,
    location: { x: 0, y: 0 },
    vertices: [
      { x: 2, y: 1.1 },
      { x: 2.5, y: 1.1 },
      { x: 2.5, y: 1.5 },
      { x: 2, y: 1.5 },
    ]
  }
]);

const shapeParams = computed(() => {
  return {
    ...props.entity.$toJSON('*'),
    // An example of specifying offsets for edge dims
    getPerimeterDimOffset(edgeIndex) {
      return edgeIndex === 2 ? 2 : 1;
    },
    dimType: PERIMETER_DIM_TYPES.AXIS,
    features: features.value
  }
});

function onUpdate({ vertices, location, id }) {
  if (id === props.entity.id) {
    return transact('Update shape', () => {
      props.entity.perimeter = vertices;
    });
  }

  const feature = features.value.find(feature => feature.id === id);

  return transact(`Update ${feature.type}`, () => {
    Object.assign(feature, { location, vertices });
  });
}

const toolbarItems = [
  {
    id: 'new_polygon',
    handler: () => {
      alert('Free geometry')
      props.entity.perimeter = [{ x: 0, y: 0, bulge: 0 }];
      props.entity.shapeType = 'free_geometry';
      return true;
    }
  },
  {
    id: 'some_tool',
    icon: AreaLoads,
    handler: () => alert('You just clicked area loads')
  }
];
</script>
