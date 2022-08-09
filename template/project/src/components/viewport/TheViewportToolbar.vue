<template>
  <LvToolbarContainer class="flex-limit relative items-center justify-between">
    <CToolbar default-tool="select" v-model="displayStore.currentTool">
      <CTool-group>
        <CTool name="Select" tool-id="select" icon="pointer-outline" />
        <CTool name="Pan" tool-id="pan" icon="hand" />
        <CTool name="Zoom" tool-id="zoom" icon="zoom-in"></CTool>
        <CTool name="Zoom to Fit" tool-id="zoom-to-fit" :stateful="false" @click="zoomToFit">
          <ZoomToFitIcon />
        </CTool>
      </CTool-group>

      <slot />

    </CToolbar>
  </LvToolbarContainer>
</template>

<script setup>
import { useDisplayStore } from '@crhio/leviate/store/display';
import ZoomToFitIcon from '@crhio/leviate/assets/icons/zoom-to-fit.svg';
import LvToolbarContainer from '@/components/styled/LvToolbarContainer.vue';

const displayStore = useDisplayStore();

const zoomToFit = () => {
  console.log('Add your implementation here');
};
</script>
