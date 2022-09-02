<template>
  <LvToolbarContainer class="flex-limit relative items-center justify-between">
    <CToolbar default-tool="select" v-model="uiStore.currentTool">
      <CTool-group>
        <CTool name="Select" tool-id="select" icon="pointer-outline" stateful/>
        <CTool name="Pan" tool-id="pan" icon="hand" stateful />
        <CTool name="Zoom" tool-id="zoom" icon="zoom-in" stateful />
        <CTool name="Zoom to Fit" tool-id="zoom-to-fit" :stateful="false" @click="zoomToFit">
          <ZoomToFitIcon />
        </CTool>
      </CTool-group>

      <slot />

    </CToolbar>
  </LvToolbarContainer>
</template>

<script setup>
import ZoomToFitIcon from '@crhio/leviate/assets/icons/zoom-to-fit.svg';
import LvToolbarContainer from '@/components/styled/LvToolbarContainer.vue';
import { useUiStore } from '@/store/ui';

const uiStore = useUiStore();

const zoomToFit = () => {
  console.log('Add your implementation here');
};
</script>
