<template>
  <!-- JSDraft sketch -->
  <!-- eslint-disable-next-line -->
  <g v-html="html"  @click="state.selectedFeatureId = null"/>

  <DOrigin v-if="origin" v-bind="originProps" />
  <DVertices
    v-model="perimeterModel"
    @move:vertex="handleMovingVertex"
    @stop-moving:vertex="handleMovingVertex"
  />

  <!-- Adding a new feature -->
  <DNewGeometry
    v-if="localFeature.shapeType === SHAPE_TYPES.POLYGONAL"
    v-model="polygonalFeatureModel"
    @close-path="createFeature"
  />
  <DDraggableFeature
    v-if="localFeature?.shapeType && state.isPointerActive"
    :key="localFeature.shapeType"
    :params="localFeature"
    :style="shapeDraftConfig.styles.activeFeature"
    :feature="featureDraft"
    :is-preview-enabled="localFeature.shapeType !== SHAPE_TYPES.POLYGONAL"
    @click="onNewFeatureClick"
  />

  <!-- Updating existing features   -->
  <DDraggableFeature
    v-for="feature in shape.features"
    :key="feature.id"
    :feature="featureDraft"
    :params="feature"
    :is-selected="state.selectedFeatureId === feature.id"
    :style="getFeatureStyle(feature)"
    @mousedown="state.selectedFeatureId = feature.id"
    @drag-end="onFeatureDragEnd(feature, $event)"
    @dragging="onFeatureDragStart(feature)"
  />

  <!-- Freehand shape -->
  <DNewGeometry v-if="state.currentTool === tools.new_polygon" v-model="perimeterModel" />

  <!-- required to enable rendering of non-svg entities (input modals) inside svg tag -->
  <foreignObject>
    <Teleport to="body">
      <DPopupVertex
        v-if="popup.data.type === 'node' && state.currentTool !== tools.round_off"
        v-model:vertex="vertexModel"
      />
      <DPopupDimensionPerimeter
        v-if="popup.data.type === 'dimension:perimeter'"
        v-model:vertices="dimensionsModel"
      />
      <DPopupDimensionAxis
        v-if="availableAxisDimensionTypes.includes(popup.data.type)"
        v-model:vertices="dimensionsModel"
      />
      <DPopupRadius v-if="isRadiusPopupVisible" v-model:vertex="vertexWithRadiusModel" />
    </Teleport>
  </foreignObject>

  <!-- Current point annotation -->
  <DHoverText
    v-if="isCurrentPointVisible && state.isPointerActive"
    :x="currentPointWithPrecision.x"
    :y="currentPointWithPrecision.y"
  />
  
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { Draft, render } from '@crhio/jsdraft';
import { computed, ref, watch, watchEffect, onBeforeUnmount, onMounted } from 'vue';

import { mirrorPath } from '../operations';
import roundoffVertex from '../operations/roundoffVertex';
import {
  SHAPE_TYPES,
  TOOLBAR_OPTIONS,
  DIMENSION_TYPES,
  AvailableToolbarOptions,
  AvailableShapeTypes,
} from '../constants';

import featureDraft from '../drafts/feature';
import shapeDraftConfig from '../drafts';
import { getSegmentRadiusFromVertexList } from '../utils';
import useDraggablePoint from '../composables/useDraggablePoint';
import useDrawing from '../composables/useDrawing';
import DOrigin from './DOrigin.vue';
import DVertices from './DVertices.vue';
import DHoverText from './DHoverText.vue';
import DNewGeometry from './DNewGeometry.vue';
import DPopupRadius from './popup/DPopupRadius.vue';
import DDraggableFeature from './DDraggableFeature.vue';
import DPopupVertex from './popup/DPopupVertex.vue';
import DPopupDimensionPerimeter from './popup/DPopupDimensionPerimeter.vue';
import DPopupDimensionAxis from './popup/DPopupDimensionAxis.vue';
import { Feature, ShapeParams, StyleProp, Point, PointWithBulge } from '../types';
import getExtents from '../utils/getExtents';

const props = defineProps<{
  shape: ShapeParams;
  draftConfig: {
    styles: {
      [key: string]: StyleProp;
    };
    settings: {
      model_unit?: string;
      plot_unit?: string;
      plot_size?: number;
    };
    toolbar: AvailableToolbarOptions[];
  };
  origin: boolean | { xColor: string; yColor: string };
  sectionLine?: {
    viewDirection: 'top' | 'bottom' | 'left' | 'right';
  };
}>();

const { config, state, sketch, tools, popup } = useDrawing();

const { currentPointWithPrecision } = useDraggablePoint();

const availableAxisDimensionTypes = [DIMENSION_TYPES.AXIS, DIMENSION_TYPES.FEATURE];

const html = ref('');
const isCurrentPointVisible = ref(false);

const mergeDraftConfig = (prop) => {
  return {
    ...shapeDraftConfig[prop],
    ...props.draftConfig[prop],
  };
};

const emit = defineEmits<{
  (e: 'update:shape', payload: { vertices: PointWithBulge[] }): void;
  (e: 'update:feature', payload: { id: string, location: Point, vertices: PointWithBulge[] }): void;
  (e: 'create:feature', payload: { shapeType: AvailableShapeTypes, location: Point, vertices: PointWithBulge[] }): void;
  (e: 'delete:feature', payload: { id: string }): void;
}>();

const originProps = computed(() => {
  if (!props.origin) return null;

  return props.origin === true ? {} : props.origin;
});
const getDefaultVertices = () => [
  { x: 0, y: 0, bulge: 0 },
  { x: 0.2, y: 0, bulge: 0 },
  { x: 0.2, y: 0.2, bulge: 0 },
  { x: 0, y: 0.2, bulge: 0 },
];
const getDefaultLocation = (): Point => ({ x: 0.1, y: 0.1 });
const localPerimeter = ref(cloneDeep(props.shape.perimeter));

const localFeature = ref<{
  shapeType: AvailableShapeTypes | null;
  vertices: PointWithBulge[];
  location: Point;
  diameter: number;
}>({
  shapeType: null,
  vertices: getDefaultVertices(),
  location: getDefaultLocation(),
  diameter: config.circleOpeningDiameter,
});

// TODO: check for invalid/overridden properties
const shapeDraft = Draft.load_config({
  ...shapeDraftConfig,
  features: mergeDraftConfig('features'),
  styles: mergeDraftConfig('styles'),
});

const defaultDraftSettings = {
  model_unit: 'm',
  plot_unit: 'mm',
  plot_size: 800,
};

watchEffect(() => {
  const draftGlobalSettings = { ...defaultDraftSettings, ...props.draftConfig.settings };

  // Dynamically assign user settings that may contain computed values
  Object.assign(shapeDraft.settings, draftGlobalSettings);

  config.units = draftGlobalSettings.plot_unit || 'mm';
  config.unitScaleFactor = getViewportScaleFactor(draftGlobalSettings.plot_unit);

  const shape = {
    ...props.shape,
    layers: props.layers,
    perimeter: localPerimeter.value,
  };

  // Render to sketch first so that it can be used in other components
  let shapeSketch = shapeDraft.render('shape', [shape], 'sketch');

  // update with a new sketch if user features specified
  if (props.userFeature) {
    shapeSketch = shapeSketch.user[props.userFeature](shape);
  }

  sketch.value = shapeSketch;
  html.value = render(sketch.value, 'svg', { viewport: null, ...shapeDraft.settings });
  // TODO: inject validators from app
  // emit('validate:openings', props.shape);
  // emit('validate:groups');
  // emit('validate:loads');
});

function getViewportScaleFactor(unit = 'm') {
  switch (unit) {
    case 'mm':
      return 1000;
    case 'cm':
      return 100;
    default:
      return 1;
  }
}

const perimeterModel = computed({
  get: () => localPerimeter.value,
  set: (vertices) => {
    // Update the temp local perimeter when dragging
    localPerimeter.value = vertices;

    // Emit the update event when not dragging, on drag ended
    if (!state.isDragging) {
      emit('update:shape', { vertices });
    }
  },
});

const popupVertices = computed(() => {
  if (popup.data.shapeType === 'perimeter') {
    return props.shape.perimeter;
  }

  return [];
  // TODO: features
});

const popupRadius = computed(() => {
  const rList = getSegmentRadiusFromVertexList(props.shape.perimeter);
  const index = popup.data.index;
  const prev = popup.data.index - 1 < 0 ? rList.length - 1 : popup.data.index - 1;
  if (rList[index] === 0 && rList[prev] !== 0) return rList[prev];

  return rList[index];
});

const vertexModel = computed({
  get: () => popupVertices.value[popup.data.index],
  set: (newVertex) => {
    if (popup.data.shapeType === 'perimeter') {
      state.isDragging = false;

      perimeterModel.value = perimeterModel.value.map((vertex, i) => {
        return Number(popup.data.index) === i ? newVertex : vertex;
      });
    }
  },
});

const dimensionsModel = computed({
  get: () => localPerimeter.value,
  set: (params) => {
    emit('update:shape', { vertices: params.vertices });
  },
});

const vertexWithRadiusModel = computed({
  get: () => {
    const vertex = popupVertices.value[popup.data.index];
    return { x: vertex.x, y: vertex.y, bulge: popupRadius.value };
  },
  set: (newVertex) => {
    if (state.currentTool === tools.round_off) {
      state.isDragging = false;
      setTimeout(() => {
        perimeterModel.value = roundoffVertex(localPerimeter.value, newVertex, newVertex.bulge);
      }, 0);
    }
  },
});

const isRadiusPopupVisible = computed(() => {
  return popup.data.type === 'node' && state.currentTool === tools.round_off;
});

function onNewFeatureClick(vertices?: PointWithBulge[]) {
  switch (localFeature.value.shapeType) {
    // polygonal feature should have a closed shape, which is handled separately
    case SHAPE_TYPES.POLYGONAL: return;
    case SHAPE_TYPES.CIRCULAR: return createFeature();
    case SHAPE_TYPES.RECTANGULAR: {
      // Use updated vertices after interaction
      localFeature.value.vertices = vertices;
      return createFeature();
    }
  }
}

function createFeature() {
  emit('create:feature', cloneDeep(localFeature.value));

  if (localFeature.value.shapeType === SHAPE_TYPES.POLYGONAL) {
    localFeature.value.vertices = [];
    localFeature.value.location = getDefaultLocation();
  }
}

function getFeatureStyle(feature: Feature): StyleProp {
  const isActive = feature.id === state.selectedFeatureId;
  return isActive || feature === localFeature.value
    ? shapeDraftConfig.styles.activeFeature
    : shapeDraftConfig.styles.draggableFeature;
}

function onFeatureDragStart(feature: Feature) {
  state.selectedFeatureId = feature.id;
  feature.isDragging = true;
  isCurrentPointVisible.value = true;
}

function onFeatureDragEnd(feature, { location, vertices }) {
  feature.isDragging = false;
  isCurrentPointVisible.value = false;
  emit('update:feature', { id: feature.id, location, vertices });
}

function updateLocalFeature(shapeType: AvailableShapeTypes | undefined) {
  if (!shapeType) return;

  const isPolygonal = shapeType === SHAPE_TYPES.POLYGONAL;

  const vertices = isPolygonal ? [] : getDefaultVertices();

  Object.assign(localFeature.value, {
    shapeType,
    vertices,
    location: getDefaultLocation(),
  });

  isCurrentPointVisible.value = !isPolygonal;
}

function handleMovingVertex(isDragging: boolean) {
  isCurrentPointVisible.value = isDragging;
}

onBeforeUnmount(() => {
  state.activeFeatureId = null;
});

const polygonalFeatureModel = computed({
  get: () => localFeature.value.vertices,
  set: (vertices) => {
    // Update the temp local features's vertices when dragging
    localFeature.value.vertices = vertices;
  },
});

watch(
  () => state.currentTool,
  (tool) => {
    switch (tool) {
      case TOOLBAR_OPTIONS.MIRROR_GEOMETRY:
        state.currentTool = TOOLBAR_OPTIONS.POINTER;
        perimeterModel.value = mirrorPath(perimeterModel.value);
        break;
      default:
        if (localFeature.value.shapeType === SHAPE_TYPES.POLYGONAL) localFeature.value.shapeType = null;
        isCurrentPointVisible.value = false;
    }
  }
);

watch(
  () => state.actionKeys.Escape,
  (esc) => {
    if (!esc) return;

    state.currentTool = TOOLBAR_OPTIONS.POINTER;
    state.toolParams = {};
    isCurrentPointVisible.value = false;
    localFeature.value.shapeType = null;

    if (localFeature.value?.shapeType === SHAPE_TYPES.POLYGONAL) {
      if (localFeature.value.vertices.length >= 3) {
        createFeature();
      } else {
        localFeature.value.vertices = [];
      }
    }
  }
);

watch(
  () => props.shape.perimeter,
  (val) => {
    if (val) localPerimeter.value = val;
  }
);

watch(() => state.toolParams.shapeType, updateLocalFeature);

watch(
  () => props.shape,
  (newShape) => {
    state.shape = newShape;
  }
);

watch(
  [() => state.actionKeys.Backspace, () => state.actionKeys.Delete],
  ([backspaceKey, deleteKey]) => {
    if (
      (backspaceKey || deleteKey) &&
      state.currentTool === tools.pointer &&
      state.selectedFeatureId
    ) {
      emit('delete:feature', { id: state.selectedFeatureId });
      state.selectedFeatureId = null;
      isCurrentPointVisible.value = false;
    }
  }
);

watch(
  () => currentPointWithPrecision.value,
  (currentPoint) => {
    // setting only if opening has a valid type, i.e. insert opening tool selected
    if (localFeature.value?.shapeType)
      localFeature.value.location = { x: currentPoint.x, y: currentPoint.y };
  }
);
</script>
