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
        @update:shape="onUpdateShape"
        @update:feature="onUpdateFeature"
        @create:feature="onCreateFeature"
        @delete:feature="features = features.filter(({ id }) => id !== $event)"
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
import RectOpeningIcon from '@/assets/rect_opening.svg';
import CircOpeningIcon from '@/assets/circle_opening.svg';
import PolyOpeningIcon from '@/assets/polygon_opening.svg';
import AreaLoads from '@/assets/area_loads.svg';
import { computed, Ref, ref } from 'vue';
import { transact } from '@crhio/leviate';
import draftConfig from '@/draft/draft.config';
import DViewport from '@crhio/leviate/drawing/components/DViewport.vue';
import LvErrorBoundary from '@crhio/leviate/components/LvErrorBoundary.vue';
import DToolbar from '@crhio/leviate/drawing/components/toolbar/DToolbar.vue';
import DEditableShape from '@crhio/leviate/drawing/components/DEditableShape.vue';
import { SHAPE_TYPES, PERIMETER_DIM_TYPES } from '@crhio/leviate/drawing/constants';
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
    shapeType: SHAPE_TYPES.CIRCULAR,
    location: { x: 0.75, y: 1.25 },
    diameter: 0.5,
    cutout: true,
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
    features: props.entity.features || features.value
  }
});

function onUpdateShape({ vertices }) {
    transact('Update shape', () => {
      props.entity.perimeter = vertices;
    });
}

function onUpdateFeature({ vertices, location, id }) {
  const feature = features.value.find(feature => feature.id === id);

  return transact(`Update ${feature.type}`, () => {
    Object.assign(feature, { location, vertices });
    props.entity.features = features;
  });
}

function onCreateFeature(feature) {
  console.log(feature.vertices);

  features.value.push({
    id: 'recessId',
    type: 'recess',
    ...feature
  });

  props.entity.features = features;
}

const TOOLBAR_OPTIONS = {
  RECT_OPENING: 'rect_opening',
  CIRCLE_OPENING: 'circle_opening',
  POLYGON_OPENING: 'polygon_opening',

  RECT_RECESS: 'rect_recess',
  CIRCLE_RECESS: 'circle_recess',
  POLYGON_RECESS: 'polygon_recess',
}

const toolbarItems = [
  {
    id: 'some_tool',
    icon: AreaLoads,
    handler: () => alert('You just clicked area loads')
  },
  {
    id: 'openings',
    children: [
      {
        id: TOOLBAR_OPTIONS.RECT_OPENING,
        icon: RectOpeningIcon,
        params: { shapeType: SHAPE_TYPES.RECTANGULAR },
        handler: () => {
          return true;
        },
      },
      {
        id: TOOLBAR_OPTIONS.CIRCLE_OPENING,
        icon: CircOpeningIcon,
        params: { shapeType: SHAPE_TYPES.CIRCULAR },
        handler: () => {
          return true;
        },
      },
      {
        id: 'polygon_opening',
        icon: PolyOpeningIcon,
        params: { shapeType: SHAPE_TYPES.POLYGONAL },
        handler: () => {
          return true;
        },
      },
    ],
  },
];
</script>
