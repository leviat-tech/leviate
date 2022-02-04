<style lang="scss" scoped>
  @import '@/assets/styles/variables.scss';

  .panel-selector-container {
    position: absolute;
    top: -0.25rem;
    left: -0.25rem;
  }

  .panel-selector-top {
    position: relative;
    border-color: $color-blue;
    border-radius: $radius $radius 0 0;
    z-index: 20;
    width: 2.25rem;
    height: 2.75rem;
    background-color: white;
  }

  .panel-selector-bottom {
    position: relative;
    margin-top: -1px;
    // left: -9.75rem;
    border-color: $color-blue;
    border-radius: 0 $radius $radius $radius;
    z-index: 10;
  }

  .icon {
    flex: none !important;
    height: 1rem !important;
    width: 1rem !important;
    margin-right: 0.5em;
    color: $color-gray-06;

    &.active {
      color: $color-black;
    }
  }

  .swatch {
    width: 1rem;
    border: 1px solid $color-gray-03;
    border-radius: $radius;
  }

 .grid-container {
  display: grid;
  grid-template-columns: auto auto;
}
.item-grid:hover {
  background-color: #56a4f1;
}
</style>

<template>
  <div class="panel-selector-container">
    <div class="panel-selector-top border-l border-t border-r">
      &nbsp;
    </div>
    <div class="grid-container panel-selector-bottom text-center border bg-white w-48">
      <div class="item-grid" v-for="(item, id) in panelItems" :key="id"
        v-on:click="$emit('selected')" @click.stop="updatePanel(item)">
        <c-icon
          class="icon"
          size="xs"
        >
          <component :is="icon(item)" />
        </c-icon>
        <div>{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, sync } from 'vuex-pathify';
import RectIcon from '@/assets/icons/rect.svg';
import PolyLIcon from '@/assets/icons/polyL.svg';
import PolyTIcon from '@/assets/icons/polyT.svg';
import PolyUIcon from '@/assets/icons/polyU.svg';


export default {
  name: 'PanelSelector',
  components: {
    RectIcon,
    PolyLIcon,
    PolyTIcon,
    PolyUIcon,
  },
  computed: {
    panelItems() {
      return {
        Panel_R: {
          name: 'Rectangle',
          icon: RectIcon,
          vertices: [
            { x: 0, y: 0 },
            { x: 5.000, y: 0 },
            { x: 5.000, y: 2.300 },
            { x: 0, y: 2.300 },
          ],
        },
        Panel_L: {
          name: 'L-Polygon',
          icon: PolyLIcon,
          vertices: [
            { x: 0, y: 0 },
            { x: 5.000, y: 0 },
            { x: 5.000, y: 1.300 },
            { x: 3.000, y: 1.300 },
            { x: 3.000, y: 2.300 },
            { x: 0, y: 2.300 },
          ],
        },
        Panel_T: {
          name: 'T-Polygon',
          icon: PolyTIcon,
          vertices: [
            { x: 0, y: 2.300 },
            { x: 0, y: 1.000 },
            { x: 1.500, y: 1.000 },
            { x: 1.500, y: 0 },
            { x: 3.500, y: 0 },
            { x: 3.500, y: 1.000 },
            { x: 5.000, y: 1.000 },
            { x: 5.000, y: 2.300 },
          ],
        },
        Panel_U: {
          name: 'U-Polygon',
          icon: PolyUIcon,
          vertices: [
            { x: 0, y: 0 },
            { x: 1.500, y: 0 },
            { x: 1.500, y: 1.300 },
            { x: 3.000, y: 1.300 },
            { x: 3.000, y: 0 },
            { x: 4.500, y: 0 },
            { x: 4.500, y: 2.300 },
            { x: 0, y: 2.300 },
          ],
        },
      };
    },
    selectedElement: sync('display/selectedElement'),
    current: get('current'),
  },
  methods: {
    updatePanel(item) {
    },
    icon(item) {
      return item.icon;
    },
  },
};
</script>
