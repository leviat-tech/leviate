<template>
  <!-- eslint-disable-next-line -->
  <g v-html="html" />

  <DOrigin v-if="origin" v-bind="originProps" />

</template>

<script setup lang="ts">
import { Draft, render } from '@crhio/jsdraft';
import { computed, ref, watchEffect } from 'vue';

import shapeDraftConfig from '../drafts';
import useDrawing from '../composables/useDrawing';
import DOrigin from './DOrigin.vue';
import { ShapeParams, StyleProp } from '../types';
import getExtents from '../utils/getExtents';
import panelSection from '../drafts/panelSection';
import perimeter from '../drafts/perimeter';
import feature from '../drafts/feature';
import featureSideView from '../drafts/featureSideView';

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
  };
  origin: boolean | { xColor: string; yColor: string };
}>();

const { config, state } = useDrawing();

const html = ref('');

const mergeDraftConfig = (prop) => {
  return {
    ...shapeDraftConfig[prop],
    ...props.draftConfig[prop],
  };
};

const originProps = computed(() => {
  if (!props.origin) return null;

  return props.origin === true ? {} : props.origin;
});

const shapeDraft = Draft.load_config({
  ...shapeDraftConfig,
  features: {
    panelSection,
    featureSideView,
    perimeter,
    feature,
  },
  styles: mergeDraftConfig('styles'),
});

const defaultDraftSettings = {
  model_unit: 'm',
  plot_unit: 'mm',
  plot_size: 800,
};

const isHorizontal = props.shape.viewDirection === 'top' || props.shape.viewDirection === 'bottom';
const shapeExtents = computed(() => getExtents(props.shape.perimeter));
const sectionCutTemp = ref(
  isHorizontal 
  ? { 
      a: { x: shapeExtents.value.xmin, y: (shapeExtents.value.ymin + shapeExtents.value.ymax) / 2 }, 
      b: { x: shapeExtents.value.xmax, y: (shapeExtents.value.ymin + shapeExtents.value.ymax) / 2 }, 
    }
  : { 
      a: { x: (shapeExtents.value.xmin + shapeExtents.value.xmax) / 2, y: shapeExtents.value.ymin }, 
      b: { x: (shapeExtents.value.xmin + shapeExtents.value.xmax) / 2, y: shapeExtents.value.ymax }, 
    }
);

watchEffect(() => {
  const draftGlobalSettings = { ...defaultDraftSettings, ...props.draftConfig.settings };

  // Dynamically assign user settings that may contain computed values
  Object.assign(shapeDraft.settings, draftGlobalSettings);

  config.units = draftGlobalSettings.plot_unit || 'mm';
  config.unitScaleFactor = getViewportScaleFactor(draftGlobalSettings.plot_unit);

  const shape = {
    ...props.shape,
    layers: props.layers,
  };

  let shapeSketch = shapeDraft.render('panelSection', [shape], 'sketch');
  html.value = render(shapeSketch, 'svg', { viewport: null, ...shapeDraft.settings });
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

</script>
