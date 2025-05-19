<template>
  <div class="flex w-full items-center justify-between px-1">
    <CToolbar default-tool="select" v-model="uiStore.currentTool">
      <CTool-group>
        <CTool name="Select" tool-id="select" icon="pointer-outline" stateful/>
        <CTool name="Pan" tool-id="pan" icon="hand" stateful />
        <CTool name="Zoom" tool-id="zoom" icon="zoom-in" stateful />
      </CTool-group>
      <CTool-group dividerLeft>
        <CTool name="Zoom to Fit" tool-id="zoom-to-fit" :stateful="false" @click="zoomToFit">
          <ZoomToFitIcon />
        </CTool>
      </CTool-group>

      <slot />

    </CToolbar>
    <CButton color="magic" class="">Calculate <CIcon type="bolt" size="sm" /></CButton>
  </div>
</template>

<script setup>
import ZoomToFitIcon from '@crhio/leviate/assets/icons/zoom-to-fit.svg';
import { useUiStore } from '@/store/ui';

const uiStore = useUiStore();

const zoomToFit = () => {
  console.log('Add your implementation here');
};
</script>
