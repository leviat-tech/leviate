<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.viewport-container {
  border-right: 1px solid $color-gray-04;
}
</style>


<template>
  <div class="viewport-container v-box">
    <viewport-toolbar />
    <c-viewport-container
      v-model="maximizedViewport"
      :options="[ 'left', 'right' ]"
      :aspect-ratio="3"
    >MAXIMIZED VIEWPORT
      <c-viewport
        v-model="leftViewport"
        viewport-id="left"
        :options="[{ label: 'Elevation', value: 'elevation' }]"
      >LEFT VIEWPORT
      </c-viewport>
      <c-viewport
        v-model="rightViewport"
        viewport-id="right"
        :options="[{ label: 'Section', value: 'section' }]"
      >RIGHT VIEWPORT
      </c-viewport>
    </c-viewport-container>
  </div>
</template>


<script>
import { get } from 'vuex-pathify';
import cloneDeep from 'lodash/cloneDeep';
import ViewportToolbar from '@/components/layout/toolbar/viewport-toolbar.vue';


export default {
  name: 'viewport-container',
  components: {
    ViewportToolbar,
  },
  data() {
    return {
      cloned: null,
      maximizedViewport: null,
      leftViewport: 'elevation',
      rightViewport: 'section',
    };
  },
  computed: {
    current: get('current'),
    route() {
      return this.$route.name;
    },
  },
  watch: {
    current: {
      immediate: true,
      handler() {
        this.cloneCurrent();
      },
    },
  },
  methods: {
    cloneCurrent() {
      this.cloned = {
        load_bearing_layer: cloneDeep(this.current.load_bearing_layer),
        facing_layer: cloneDeep(this.current.facing_layer),
        insulation_thickness: this.current.insulation_thickness,
      };
    },
    updateClone(panel) {
      this.cloned = panel;
    },
    updateVertex(point, locations) {
      this.$transact(async () => {
        locations.forEach(async (location) => {
          const pt = location.translation
            ? { x: point.x - location.translation.x, y: point.y - location.translation.y }
            : point;

          const Model = location.shape_type === 'load_bearing'
            ? LoadbearingShape
            : FacingShape;

          const instance = Model.find(location.shape_id);
          await instance.$update(`${location.path}[${location.index}]`, pt);
        });
      });
    },
    updateShape(updates) {
      this.$transact(async () => {
        updates.forEach(async (u) => {
          const Model = u.shape_type === 'load_bearing'
            ? LoadbearingShape
            : FacingShape;

          const instance = Model.find(u.shape_id);
          await instance.$update(u.location, u.update);
        });
      });
    },
  },
};
</script>
