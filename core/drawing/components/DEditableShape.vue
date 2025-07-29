<template>
  <!-- JSDraft sketch -->
  <!-- eslint-disable-next-line -->
  <g v-html="html" />

  <DOrigin v-if="origin" v-bind="originProps" />
  <DVertices
    :shape-id="shape.id"
    v-model="perimeterModel"
    @move:vertex="handleMovingVertex"
    @stop-moving:vertex="handleMovingVertex"
  />

  <!-- Updating existing features   -->
  <component
    v-for="feature in shape.features"
    :is="featureComponents[feature.shapeType]"
    :key="feature.id"
    :feature="featureDraft"
    :shape-draft="shapeDraft"
    :params="feature"
    :is-selected="state.selectedFeatureId === feature.id"
    :style="getFeatureStyle(feature)"
    @mousedown="selectFeature(feature.id)"
    @dragging="onFeatureDrag(feature, $event)"
    @drag-end="onFeatureDragEnd(feature, $event)"
  />

  <!-- Adding a new feature -->
  <DNewGeometry
    v-if="localFeature.shapeType === SHAPE_TYPES.POLYGONAL"
    v-model="polygonalFeatureModel"
    @close-path="createFeature"
  />
  <component
    v-if="localFeature?.shapeType && state.isPointerActive"
    data-type="feature"
    :is="featureComponents[localFeature.shapeType]"
    :params="localFeature"
    :style="shapeDraftConfig.styles.activeFeature"
    :shape-draft="shapeDraft"
    :is-preview-enabled="localFeature.shapeType !== SHAPE_TYPES.POLYGONAL"
    @click="onNewFeatureClick"
  />

  <!-- Freehand shape -->
  <DNewGeometry v-if="state.currentTool === tools.new_polygon" v-model="perimeterModel" />

  <!-- required to enable rendering of non-svg entities (input modals) inside svg tag -->
  <foreignObject>
    <Teleport to="body">
      <DPopupVertex
        v-if="popup.data.type === 'node' && state.currentTool !== tools.round_off"
        v-model:vertex="vertexPopupModel"
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

      <DPopupNewFeature v-if="isPlacingFeature" v-model="localFeature" @confirm="createFeature"/>
    </Teleport>
  </foreignObject>

  <!-- Current point annotation -->
  <DHoverText
    v-if="isCurrentPointVisible && state.isPointerActive && !popup.isOpen"
    :x="currentPointWithPrecision.x"
    :y="currentPointWithPrecision.y"
    transform
  />

</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { Draft, render } from '@crhio/jsdraft';
import { computed, markRaw, onBeforeUnmount, ref, watch, watchEffect } from 'vue';

import { mirrorPath } from '../operations';
import roundoffVertex from '../operations/roundoffVertex';
import {
  AvailableShapeTypes,
  AvailableToolbarOptions,
  DIMENSION_TYPES,
  SHAPE_TYPES,
  TOOLBAR_OPTIONS,
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
import DPopupVertex from './popup/DPopupVertex.vue';
import DPopupDimensionPerimeter from './popup/DPopupDimensionPerimeter.vue';
import DPopupDimensionAxis from './popup/DPopupDimensionAxis.vue';
import DPopupNewFeature from './popup/DPopupNewFeature.vue';
import { Feature, Point, PointWithBulge, ShapeParams, StyleProp } from '../types';
import DFeatureCirc from './DFeatureCirc.vue';
import DFeatureRect from './DFeatureRect.vue';
import DFeaturePoly from './DFeaturePoly.vue';

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
}>();

const { config, state, sketch, tools, popup, openPopup } = useDrawing();

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

  // We don't use this value but it is required in reactive deps to ensure
  // hatching stroke width remains in sync with current zoom scale
  const scale = state.pxToSvg;

  sketch.value = markRaw(shapeSketch);
  html.value = render(shapeSketch, 'svg', { viewport: null, ...shapeDraft.settings });
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
  if (popup.data.shapeId === props.shape.id) {
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

/**
 * Model for updating vertices via modal popup
 */
const vertexPopupModel = computed({
  get: () => {
    const x = Number(popup.target?.getAttribute('cx'));
    const y = Number(popup.target?.getAttribute('cy'));

    return { x, y };
  },
  set: (newVertex) => {
    const { index, shapeId } = popup.data;
    const isFeature = shapeId !== props.shape.id;
    const oldVertices = isFeature ? getFeatureById(shapeId).vertices : props.shape.perimeter;

    const vertices = oldVertices.map((vertex: PointWithBulge, i: number) => {
      return Number(index) === i ? { ...vertex, ...newVertex } : vertex;
    });

    if (isFeature) {
      emit('update:feature', { id: shapeId, vertices });
    } else {
      emit('update:shape', { vertices })
    }
    return;
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


/*********************************** FEATURES ***********************************/

const featureComponents = {
  [SHAPE_TYPES.CIRCULAR]: DFeatureCirc,
  [SHAPE_TYPES.RECTANGULAR]: DFeatureRect,
  [SHAPE_TYPES.POLYGONAL]: DFeaturePoly,
}

const isPlacingFeature = ref<boolean>(false);

function selectFeature(featureId: string) {
  if (state.currentTool === TOOLBAR_OPTIONS.POINTER) {
    state.selectedFeatureId = featureId;
  }
}

function onNewFeatureClick(e: MouseEvent) {
  isPlacingFeature.value = true;
  openPopup(e, localFeature.value);
  // Ensure popup does not cover feature when placing
  popup.y += 80;
}

function createFeature() {
  isPlacingFeature.value = false;
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

function onFeatureDrag(feature: Feature, targetType: 'feature' | 'anchor') {
  feature.isDragging = true;
  if (targetType === 'feature') {
    isCurrentPointVisible.value = true;
  }
}

function onFeatureDragEnd(feature: Feature, updateParams: Partial<Feature>) {
  feature.isDragging = false;
  isCurrentPointVisible.value = false;
  emit('update:feature', { id: feature.id, ...updateParams });
  state.selectedFeatureId = feature.id;
}

function getFeatureById(id: string): Feature | undefined {
  return props.shape.features.find(item => item.id === id);
}

function updateLocalFeature(shapeType: AvailableShapeTypes | undefined) {
  if (!shapeType) return;

  popup.data.shapeType = shapeType;

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
        localFeature.value.shapeType = null;
        isCurrentPointVisible.value = false;
    }

    if (tool !== TOOLBAR_OPTIONS.POINTER) {
      state.selectedFeatureId = null;
    }
  }
);

/**
 * Reset tool to default on Escape.
 * If creating a polygonal feature then
 * close the shape and create the feature
 */
watch(
  () => state.actionKeys.Escape,
  (esc) => {
    if (!esc) return;

    state.currentTool = TOOLBAR_OPTIONS.POINTER;
    state.toolParams = {};
    isCurrentPointVisible.value = false;

    if (localFeature.value?.shapeType === SHAPE_TYPES.POLYGONAL) {
      if (localFeature.value.vertices.length >= 3) {
        createFeature();
      } else {
        localFeature.value.vertices = [];
      }
    }

    localFeature.value.shapeType = null;
  }
);

/**
 * Update local perimeter when props change
 */
watch(
  () => props.shape.perimeter,
  (val) => {
    if (val) localPerimeter.value = val;
  }
);

/**
 * Update local feature when shapeType changes
 */
watch(() => state.toolParams.shapeType, updateLocalFeature);

// TODO: not sure what this is for
watch(
  () => props.shape,
  (newShape) => {
    // state.shape = newShape;
  }
);

/**
 * Handle deleting features with keyboard
 */
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

/**
 *
 */
watch(
  () => currentPointWithPrecision.value,
  (currentPoint) => {
    // setting only if opening has a valid type, i.e. insert opening tool selected
    if (localFeature.value?.shapeType && !popup.isOpen)
      localFeature.value.location = { x: currentPoint.x, y: currentPoint.y };
  }
);

onBeforeUnmount(() => {
  state.activeFeatureId = null;
});
</script>
