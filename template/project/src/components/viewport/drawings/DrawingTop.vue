<template>
  <DViewport
    current-tool="select"
    data-cy="viewport_2d"
    :padding="0.5"
    show-grid
  >
    <DEditableShape
      :key="entity.id"
      :shape="shapeParams"
      :dim-count="[]"
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
</template>

<script setup>
import { computed, ref } from 'vue';
import { transact } from '@crhio/leviate';
import draftConfig from '@/draft/draft.config';
import DViewport from '@crhio/leviate/drawing/components/DViewport.vue';
import DEditableShape from '@crhio/leviate/drawing/components/DEditableShape.vue';
import { FEATURE_TYPES } from '@crhio/leviate/drawing/constants';

const props = defineProps({
  entity: Object
});

// Define arbitrary features. In an app, these will likely be in models
const features = ref([
  {
    id: 'openingId',
    type: 'opening',
    shapeType: FEATURE_TYPES.circular,
    location: { x: 0.75, y: 1.25 },
    diameter: 0.5,
  },
  {
    id: 'recessId',
    type: 'recess',
    shapeType: FEATURE_TYPES.rectangular,
    vertices: [
      { x: 2, y: 0.5 },
      { x: 2.5, y: 0.5 },
      { x: 2.5, y: 1 },
      { x: 2, y: 1 },
    ]
  },
  {
    id: 'upstandId',
    type: 'upstand',
    cutout: true,
    shapeType: FEATURE_TYPES.rectangular,
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
    features: features.value
  }
});

const colorClasses = {
  red: 'bg-red-300',
  orange: 'bg-orange-300',
  yellow: 'bg-yellow-300',
  green: 'bg-green-300',
  blue: 'bg-blue-300',
  purple: 'bg-purple-300',
};

const colorClass = computed(() => {
  return colorClasses[props.entity.color.top];
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

function addOpening(opening) {
  transact(() => {
    OpeningModel.create({ shapeId: shape.value.id, ...opening });
  });
}
</script>
