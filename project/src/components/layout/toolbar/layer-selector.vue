<style lang="scss" scoped>
  @import '@/assets/styles/variables.scss';

  .layer-selector-container {
    position: absolute;
    top: -0.25rem;
    left: -0.25rem;
  }

  .layer-selector-top {
    position: relative;
    border-color: $color-blue;
    border-radius: $radius $radius 0 0;
    z-index: 20;
    width: 2.5rem;
    height: 2.75rem;
    background-color: white;
  }

  .layer-selector-bottom {
    position: relative;
    margin-top: -1px;
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
</style>

<template>
  <div class="layer-selector-container">
    <div class="layer-selector-top border-l border-t border-r">
      &nbsp;
    </div>
    <div class="layer-selector-bottom text-left border bg-white px-4 py-2 w-48">
      <div class="w-full flex items-center justify-start" v-for="(layer, id) in layerInfo" :key="id">
        <c-icon
          class="icon"
          size="xs"
          :class="{ active: layers[id].editable }"
          @click.stop="toggleEditable(id)"
        >
          <lock-open-icon v-if="layers[id].editable" />
          <lock-icon v-else />
        </c-icon>
        <c-icon
          class="icon"
          size="xs"
          :class="{ active: layers[id].visible }"
          @click.stop="toggleVisible(id)"
        >
          <eye-icon v-if="layers[id].visible" />
          <eye-slash-icon v-else />
        </c-icon>
        <div
          class="icon swatch"
          :style="{ backgroundColor: layer.color }"
        />
        <div>{{ layer.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { sync } from 'vuex-pathify';
import EyeIcon from '@/assets/icons/eye.svg';
import EyeSlashIcon from '@/assets/icons/eye-slash.svg';
import LockIcon from '@/assets/icons/lock.svg';
import LockOpenIcon from '@/assets/icons/lock-open.svg';


export default {
  name: 'LayerSelector',
  components: {
    EyeIcon,
    EyeSlashIcon,
    LockIcon,
    LockOpenIcon,
  },
  computed: {
    layers: sync('display/layers'),
    layerInfo() {
      return {
        load_bearing: {
          name: 'Load-bearing',
          color: '#AFAFAF',
        },
        facing: {
          name: 'Facing',
          color: '#5498D1',
        },
      };
    },
  },
  methods: {
    toggleEditable(id) {
      this.layers[id].editable = !this.layers[id].editable;
    },
    toggleVisible(id) {
      this.layers[id].visible = !this.layers[id].visible;
    },
  },
};
</script>
