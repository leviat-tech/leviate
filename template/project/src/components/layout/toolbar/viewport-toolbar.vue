<style scoped lang="scss">

  .menu {
    min-height: 3rem;
  }

</style>

<template>
  <div class="menu h-box flex-limit relative items-center flex-wrap justify-between border-b px-2">
    <c-toolbar default-tool="select" v-model="currentTool">
      <c-tool-group>
        <c-tool name="Select" tool-id="select" icon="pointer-outline" />
        <c-tool name="Pan" tool-id="pan" icon="hand" />
        <c-tool name="Zoom" tool-id="zoom">
          <search-plus-icon />
        </c-tool>
        <c-tool name="Zoom to Fit" tool-id="zoom-to-fit" :stateful="false" @click="zoomToFit">
          <zoom-to-fit-icon />
        </c-tool>
        <c-tool
          class="relative"
          name="Layers"
          tool-id="layers"
          :stateful="false"
          @click="showLayerSelector = !showLayerSelector"
        >
          <layer-group-icon class="z-30" />
          <layer-selector v-if="showLayerSelector" />
        </c-tool>
      </c-tool-group>

      <slot />

    </c-toolbar>
  </div>
</template>

<script>
import { mapWritableState } from 'pinia';
import { useDisplayStore } from '@crhio/leviate/store/display';
import LayerGroupIcon from '@crhio/leviate/assets/icons/layer-group.svg';
import PointerPlusIcon from '@crhio/leviate/assets/icons/pointer-plus.svg';
import PointerMinusIcon from '@crhio/leviate/assets/icons/pointer-minus.svg';
import ZoomToFitIcon from '@crhio/leviate/assets/icons/zoom-to-fit.svg';
import SearchPlusIcon from '@crhio/leviate/assets/icons/search-plus.svg';

export default {
  name: 'viewport-toolbar',
  components: {
    ZoomToFitIcon,
    PointerPlusIcon,
    PointerMinusIcon,
    SearchPlusIcon,
    LayerGroupIcon,
  },
  data() {
    return {
      showLayerSelector: false,
      showPanelSelector: false,
      showFeatureSelector: false,
    };
  },
  computed: {
    ...mapWritableState(useDisplayStore, ['currentTool']),
  },
  methods: {
    zoomToFit() {
    },
  },
};
</script>
