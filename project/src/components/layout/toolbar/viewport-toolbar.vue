<style scoped lang="scss">
  @import '@/assets/styles/variables.scss';

  .menu {
    border-bottom: $border;
    min-height: $toolbar-height;
  }

</style>

<template>
  <div class="menu h-box flex-limit relative items-center flex-wrap justify-between px-2">
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
      <c-tool-group>
        <c-tool name="Add Vertex" tool-id="add-vertex">
          <pointer-plus-icon />
        </c-tool>
        <c-tool name="Add Vertex" tool-id="remove-vertex">
          <pointer-minus-icon />
        </c-tool>
        <c-tool
          class="relative"
          name="predefined panel"
          tool-id="predefined-panel"
          :stateful="false"
          @click="showPanelSelector = !showPanelSelector">
          <polygon-icon class="z-30" />
          <panel-selector v-if="showPanelSelector" v-on:selected="showPanelSelector=false"/>
        </c-tool>
        <c-tool name="Hole" tool-id="hole">
          <hole-icon />
        </c-tool>
        <c-tool
          class="relative"
          name="Thickening"
          tool-id="thickening"
          @click="showFeatureSelector = !showFeatureSelector">
          <thickening-icon class="z-30"/>
          <feature-selector v-if="showFeatureSelector" v-on:selected="showFeatureSelector=false"/>
        </c-tool>
      </c-tool-group>
      <c-tool-group>
        <c-tool name="Vertical Gridline" tool-id="gridline-vertical" :disabled="true">
          <gridline-vertical-icon />
        </c-tool>
        <c-tool name="Horizontal Gridline" tool-id="gridline-horiontal" :disabled="true">
          <gridline-horizontal-icon />
        </c-tool>
        <c-tool name="Anchor" tool-id="anchor" :disabled="true">
          <anchor-icon />
        </c-tool>
      </c-tool-group>
    </c-toolbar>
    <div>
      <c-button
        size="xs"
        class="mr-2"
        @click="autolayout"
      >
        Autolayout
      </c-button>
      <c-button
        size="xs"
        class="mr-2"
        @click="mockCalculation(current.id)"
      >
        Calculation
      </c-button>
    </div>
  </div>
</template>

<script>
import { sync, get, call } from 'vuex-pathify';
import PointerPlusIcon from '@/assets/icons/pointer-plus.svg';
import PointerMinusIcon from '@/assets/icons/pointer-minus.svg';
import ZoomToFitIcon from '@/assets/icons/zoom-to-fit.svg';
import SearchPlusIcon from '@/assets/icons/search-plus.svg';
import HoleIcon from '@/assets/icons/hole.svg';
import ThickeningIcon from '@/assets/icons/thickening.svg';
import GridlineVerticalIcon from '@/assets/icons/gridline-vertical.svg';
import GridlineHorizontalIcon from '@/assets/icons/gridline-horizontal.svg';
import AnchorIcon from '@/assets/icons/anchor.svg';
import LayerSelector from '@/components/layout/toolbar/layer-selector.vue';
import LayerGroupIcon from '@/assets/icons/layer-group.svg';
import PanelSelector from '@/components/layout/toolbar/panel-selector.vue';
import FeatureSelector from '@/components/layout/toolbar/feature-selector.vue';
import PolygonIcon from '@/assets/icons/polygon.svg';

export default {
  name: 'viewport-toolbar',
  components: {
    ZoomToFitIcon,
    PointerPlusIcon,
    PointerMinusIcon,
    SearchPlusIcon,
    HoleIcon,
    ThickeningIcon,
    GridlineVerticalIcon,
    GridlineHorizontalIcon,
    AnchorIcon,
    LayerGroupIcon,
    PolygonIcon,
    LayerSelector,
    PanelSelector,
    FeatureSelector,
  },
  data() {
    return {
      showLayerSelector: false,
      showPanelSelector: false,
      showFeatureSelector: false,
    };
  },
  computed: {
    currentTool: sync('display/currentTool'),
    activeViewport: sync('display/activeViewport'),
    current: get('current'),
  },
  methods: {
    mockCalculation: call('calculation/calculation_mock'),
    async autolayout() {
      let gridlines;
      try {
        gridlines = autogrid(this.current);
      } catch (e) {
        console.log(e);
        this.$store.dispatch(
          'errors/setTemporaryGlobalError',
          { type: 'gridlines', text: 'Sorry, something went wrong on gridline generation. Pease try with another grid spacing' },
          { root: true },
        );
        return;
      }
    },
    zoomToFit() {
      bus.$emit('zoomViewportToExtents', 'elevation');
      bus.$emit('zoomViewportToExtents', 'section');
    },
  },
};
</script>
