<template>
  <DPopupWrapper class="w-32">
    <DPopupNewFeatureCirc
      v-if="modelValue.shapeType === SHAPE_TYPES.CIRCULAR"
      v-model:diameter="modelValue.diameter"
    />
    <DPopupNewFeatureRect
      v-else
      :location="modelValue.location"
      v-model:vertices="modelValue.vertices"
    />
  </DPopupWrapper>
</template>

<script setup lang="ts">
import DPopupWrapper from './DPopupWrapper.vue';
import DPopupNewFeatureRect from './PopupNewFeatureRect.vue'
import DPopupNewFeatureCirc from './PopupNewFeatureCirc.vue'
import { PointWithBulge } from '../../types';
import { AvailableShapeTypes, SHAPE_TYPES } from '../../constants';

const props = defineProps<{
  modelValue: {
    location: Point;
    shapeType: AvailableShapeTypes;
    diameter: number,
    vertices: PointWithBulge[],
  }
}>();
</script>
