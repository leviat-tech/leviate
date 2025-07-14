<template>
  <LvErrorBoundary :instance="entity">
    <DViewport
      current-tool="select"
      data-cy="viewport_2d"
      :padding="viewport.padding"
      :show-grid="viewport.showGrid"
    >
      <DEditableShape
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
      :items="toolbar.items"
      :formatter="tool => $l(`tooltip_${tool}`)"
    />
  </LvErrorBoundary>
</template>

<script setup lang="ts">
import DViewport from '../drawing/components/DViewport.vue';
import DToolbar from '../drawing/components/toolbar/DToolbar.vue';
import DEditableShape from '../drawing/components/DEditableShape.vue';
import { ToolItem } from '../drawing/types';
import BaseModel from '../BaseModel';

const props = defineProps<{
  entity: any,
  toolbar: {
    items: ToolItem[],
  },
  viewport: {
    padding?: number;
    showGrid?: boolean;
  }
}>()
</script>
