<template>
  <!-- JSDraft sketch -->
  <!-- eslint-disable-next-line -->
  <g v-html="html" />

  <DOrigin v-if="origin" v-bind="originProps" />
  <DVertices
    v-model="perimeterModel"
    @move:vertex="handleMovingVertex"
    @stop-moving:vertex="handleMovingVertex"
  />

  <!-- Adding a new opening -->
  <DNewGeometry v-if="localOpening.type === FEATURE_TYPES.polygonal" v-model="openingModel" />
  <DDraggableSketch
    v-if="Boolean(localOpening.type)"
    :key="localOpening.type"
    :params="localOpening"
    :feature="featureDraft"
    :style="props.draftConfig.styles[feature.type]"
    :is-preview-enabled="localOpening.type !== FEATURE_TYPES.polygonal"
    @click="addNewOpening"
  />

  <!-- Updating existing openings   -->
  <DDraggableSketch
    v-for="feature in shape.features"
    :key="feature.id"
    :feature="featureDraft"
    :params="feature"
    :style="{ fill: { opacity: 0.000001 } }"
    @drag-end="onFeatureDragEnd(feature, $event)"
    @dragging="onFeatureDragStart(feature)"
  />

  <!-- Freehand shape -->
  <DNewGeometry v-if="state.currentTool === tools.new_polygon" v-model="perimeterModel" />

  <!-- required to enable rendering of non-svg entities inside svg tag -->
  <foreignObject>
    <Teleport to="body">
      <DPopupVertex
        v-if="popup.data.type === 'node' && state.currentTool !== tools.round_off"
        v-model:vertex="vertexModel"
      />
      <DPopupDimensionPerimeter v-if="popup.data.type === 'dimension:perimeter'" v-model:vertices="dimensionsModel" />
      <DPopupDimensionAxis v-if="availableAxisDimensionTypes.includes(popup.data.type)" v-model:vertices="dimensionsModel" />
      <DPopupRadius v-if="isRadiusPopupVisible" v-model:vertex="vertexWithRadiusModel" />
    </Teleport>
  </foreignObject>

  <DHoverText
    v-if="isCurrentPointVisible"
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
import { DIMENSION_TYPES, FEATURE_TYPES } from '../constants.ts';

import DDraggableSketch from '../components/DDraggableSketch.vue';
import featureDraft from '../drafts/feature';
import DOrigin from './DOrigin.vue';
import DVertices from './DVertices.vue';
import shapeDraftConfig from '../drafts';
import DHoverText from './DHoverText.vue';
import DNewGeometry from './DNewGeometry.vue';
import DPopupRadius from './popup/DPopupRadius.vue';
import useDrawing from '../composables/useDrawing.ts';
import DPopupVertex from './popup/DPopupVertex.vue';
import DPopupDimensionPerimeter from './popup/DPopupDimensionPerimeter.vue';
import DPopupDimensionAxis from './popup/DPopupDimensionAxis.vue';
import { getSegmentRadiusFromVertexList } from '../utils';
import useDraggablePoint from '../composables/useDraggablePoint';
import { DraftConfig } from "../types";

const props = defineProps<{
  shape: unknown;
  origin: boolean;
  userFeature?: string;
  draftConfig: DraftConfig
}>();

const { config, state, sketch, tools, popup } = useDrawing();

const { currentPointWithPrecision } = useDraggablePoint();

const availableAxisDimensionTypes = [
  DIMENSION_TYPES.AXIS,
  DIMENSION_TYPES.WIDTH,
  DIMENSION_TYPES.HEIGHT,
  DIMENSION_TYPES.FEATURE,
];

const html = ref('');
const isCurrentPointVisible = ref(false);

const mergeDraftConfig = prop => {
  return {
    ...shapeDraftConfig[prop],
    ...props.draftConfig[prop],
  };
};

const emit = defineEmits([
  'add:opening',
  'update',
  'delete:opening',
  'update:dimension',
  'delete:activeOpening',
]);

const originProps = computed(() => {
  if (!props.origin) return null;

  return props.origin === true ? {} : props.origin;
});
const defaultVertices = [
  { x: 0, y: 0, bulge: 0 },
  { x: 0.2, y: 0, bulge: 0 },
  { x: 0.2, y: 0.2, bulge: 0 },
  { x: 0, y: 0.2, bulge: 0 },
];
const defaultLocation = { x: 0.1, y: 0.1 };
const localPerimeter = ref(cloneDeep(props.shape.perimeter));
const localOpening = ref({
  type: '',
  vertices: [...defaultVertices],
  location: { ...defaultLocation },
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
}

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
    activeFeatureId: state.activeFeatureId,
    invalidOpeningIds: state.invalidOpeningIds,
  };

  console.log(shape, popup)

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
  set: vertices => {
    // Update the temp local perimeter when dragging
    localPerimeter.value = vertices;

    // Emit the update event when not dragging, on drag ended
    if (!state.isDragging) {
      emit('update', { id: props.shape.id, vertices });
    }
  },
});

const popupVertices = computed(() => {
  if (popup.data.shapeType === 'perimeter') {
    return props.shape.perimeter;
  }

  return [];
  // TODO: openings
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
  set: newVertex => {
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
  set: params => {
    emit('update', { id: props.shape.id, vertices: params.vertices });
  },
});

const vertexWithRadiusModel = computed({
  get: () => {
    const vertex = popupVertices.value[popup.data.index];
    return { x: vertex.x, y: vertex.y, bulge: popupRadius.value };
  },
  set: newVertex => {
    if (state.currentTool === tools.round_off) {
      state.isDragging = false;
      setTimeout(() => {
        perimeterModel.value = roundoffVertex(localPerimeter.value, newVertex, newVertex.bulge);
      }, 0);
    }
  },
});

const selectedOpening = computed(() =>
  props.shape.openings.find(({ id }) => id === state.activeFeatureId),
);

const isRadiusPopupVisible = computed(() => {
  return popup.data.type === 'node' && state.currentTool === tools.round_off;
});

function addNewOpening() {
  // polygonal opening should have a closed shape, which is handled separately
  if (localOpening.value.type === FEATURE_TYPES.polygonal) return;
  emit('add:opening', { ...localOpening.value });
}

function onFeatureDragStart(feature) {
  feature.isDragging = true;
  isCurrentPointVisible.value = true;

}

function onFeatureDragEnd(feature, { location, vertices }) {
  feature.isDragging = false;
  isCurrentPointVisible.value = false;
  emit('update', { id: feature.id, location, vertices });
}

function updateLocalOpening(type, vertices, location) {
  localOpening.value.type = type;
  localOpening.value.vertices = vertices;
  localOpening.value.location = { ...location };
}

function handleMovingVertex(isDragging) {
  isCurrentPointVisible.value = isDragging;
}

onBeforeUnmount(() => {
  state.activeFeatureId = null;
});

watch(
  () => state.currentTool,
  tool => {
    switch (tool) {
      case tools.polygon_opening:
        updateLocalOpening(FEATURE_TYPES.polygonal, [], defaultLocation);
        isCurrentPointVisible.value = false;
        break;
      case tools.rect_opening:
        updateLocalOpening(FEATURE_TYPES.rectangular, defaultVertices, defaultLocation);
        isCurrentPointVisible.value = true;
        break;
      case tools.circle_opening:
        updateLocalOpening(FEATURE_TYPES.circular, defaultVertices, defaultLocation);
        isCurrentPointVisible.value = true;
        break;
      case tools.mirror_geometry:
        state.currentTool = tools.pointer;
        perimeterModel.value = mirrorPath(perimeterModel.value);
        break;
      default:
        if (localOpening.value.type !== FEATURE_TYPES.polygonal) localOpening.value.type = '';
        isCurrentPointVisible.value = false;
    }
  },
);

watch(
  () => state.actionKeys.Escape,
  esc => {
    if (!esc) return;

    state.currentTool = tools.pointer;
    if (
      localOpening.value.type === FEATURE_TYPES.polygonal &&
      localOpening.value.vertices.length < 3
    ) {
      localOpening.value.vertices = [];
      localOpening.value.location = { ...defaultLocation };
      localOpening.value.type = '';
    }
  },
);

watch(
  () => props.shape.perimeter,
  val => {
    if (val) localPerimeter.value = val;
  },
);

watch(
  () => props.shape,
  newShape => {
    state.shape = newShape;
  },
);

watch(
  () => state.activeFeatureId,
  val => {
    if (val) {
      emit('update:activeOpening', val);
    }
  },
);

watch(
  [() => state.actionKeys.Backspace, () => state.actionKeys.Delete],
  ([backspaceKey, deleteKey]) => {
    if (
      (backspaceKey || deleteKey) &&
      state.currentTool === tools.pointer &&
      state.activeFeatureId
    ) {
      emit('delete:activeOpening', state.activeFeatureId);
      state.activeFeatureId = null;
      isCurrentPointVisible.value = false;
    }
  },
);

watch(
  () => currentPointWithPrecision.value,
  currentPoint => {
    // setting only if opening has a valid type, i.e. insert opening tool selected
    if (localOpening.value.type)
      localOpening.value.location = { x: currentPoint.x, y: currentPoint.y };
  },
);
</script>
