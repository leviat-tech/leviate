<style lang="scss" scoped>
  @import '@/assets/styles/variables.scss';

  .feature-selector-container {
    position: absolute;
    top: -0.25rem;
    left: -0.25rem;
  }

  .feature-selector-top {
    position: relative;
    border-color: $color-blue;
    border-radius: $radius $radius 0 0;
    z-index: 20;
    width: 2.25rem;
    height: 2.75rem;
    background-color: white;
  }

  .feature-selector-bottom {
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

  .image {
    // margin-left: 0.3rem;
    // margin-right: 0.3rem;
    width: 100%
  }
 .grid-container {
  display: grid;
  grid-template-columns: auto auto;
}
.item-grid {
  margin-top: 3px;
  margin-left: 3px;
  margin-right: 3px;
}
.item-grid:hover {
  margin-top: 3px;
  background-color: #56a4f1;
}
</style>

<template>
  <div class="feature-selector-container">
    <div class="feature-selector-top border-l border-t border-r">
      &nbsp;
    </div>
    <div class="grid-container feature-selector-bottom text-center border bg-white w-48">
      <div class="item-grid" v-for="(item, id) in featureItems" :key="id"
        v-on:click="$emit('selected')" @click.stop="selectFeature(item)">
        <img :src=icon(item) class="image">
        <div class="image" :style="{ 'background-color': selectedcolor(item) }">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, sync } from 'vuex-pathify';
import FeatureIcon1 from '@/assets/feature_1.png';
import FeatureIcon2 from '@/assets/feature_3.png';
import FeatureIcon3 from '@/assets/feature_4.png';
import FeatureIcon4 from '@/assets/feature_2.png';
import FeatureIcon5 from '@/assets/feature_5.png';
import FeatureIcon6 from '@/assets/feature_6.png';


export default {
  name: 'FeatureSelector',
  props: {
  },
  components: {
  },
  computed: {
    layers: sync('display/layers'),
    featureItems() {
      const items = [];
      if (this.layers.facing.visible) {
        items.push([
          {
            name: 'leg',
            icon: FeatureIcon1,
          },
          {
            name: 'recess',
            icon: FeatureIcon2,
          },
          {
            name: 'jamb',
            icon: FeatureIcon3,
          },
          {
            name: 'viewside',
            icon: FeatureIcon4,
          },
        ]);
      }
      if (this.layers.load_bearing.visible) {
        items.push([
          {
            name: 'amplification',
            icon: FeatureIcon5,
          },
          {
            name: 'excavation',
            icon: FeatureIcon6,
          },
        ]);
      }
      return items.flat();
    },
    selectedElement: sync('display/selectedElement'),
    current: get('current'),
    selectedFt: sync('display/selectedFeatureType'),
  },
  methods: {
    selectFeature(item) {
      this.selectedFt = item;
    },
    icon(item) {
      return item.icon;
    },
    selectedcolor(item) {
      return (this.selectedFt === null || this.selectedFt.name !== item.name) ? 'transparent' : '#9fc8f1';
    },
  },
};
</script>
