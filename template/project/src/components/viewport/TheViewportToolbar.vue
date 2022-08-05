<template>
  <lv-toolbar-container class="flex-limit relative items-center justify-between">
    <c-toolbar default-tool="select" v-model="displayStore.currentTool">
      <c-tool-group>
        <c-tool name="Select" tool-id="select" icon="pointer-outline" />
        <c-tool name="Pan" tool-id="pan" icon="hand" />
        <c-tool name="Zoom" tool-id="zoom" icon="zoom-in"></c-tool>
        <c-tool name="Zoom to Fit" tool-id="zoom-to-fit" :stateful="false" @click="zoomToFit">
          <zoom-to-fit-icon />
        </c-tool>
      </c-tool-group>

      <slot />

    </c-toolbar>
  </lv-toolbar-container>
</template>

<script setup>
import { reactive } from 'vue';
import { useDisplayStore } from '@crhio/leviate/store/display';
import ZoomToFitIcon from '@crhio/leviate/assets/icons/zoom-to-fit.svg';
import LvToolbarContainer from '@/components/styled/LvToolbarContainer.vue';


const displayStore = useDisplayStore();

const zoomToFit = () => {
  console.log('Add your implementation here');
}
</script>
