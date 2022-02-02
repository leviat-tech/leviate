<style scoped lang="scss">
  @import '@/assets/styles/variables.scss';

  $border: 1px solid $color-gray-04;

  .k-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 13px;
    flex-grow: 1;
    min-width: 0;
    min-height: 0;
  }
  .menu {
    border-bottom: $border;
  }

  .project {
    flex: none;
    max-width: 240px;
    min-width: 240px;
    border-right: $border;
  }

  .project, .contents {
    border-right: $border;
  }
  .center {
    border-right: $border;
  }
  .right {
    width: 22rem;
  }
  .content {
    padding-left: 0px;
    padding-right: 0px;
  }
</style>


<template>
  <div class="k-layout">
    <div class="h-box" ref="trifold">

      <div class="flex flex-col flex-grow">
        <div class="h-box flex">
          <!-- project panel -->
          <div class="project flex-limit v-box scroll">
            <k-project/>
          </div>

          <viewport-container />
        </div>
      </div>

      <!-- preview panel -->
      <c-resizable
        class="right flex-limit v-box"
        :min="405"
        :max="maxDrawingWidth"
      >
        <!-- properties panel -->
        <k-configuration
          class="center v-box scroll"
          :class="{ 'single-column': singleColumnView }"
          ref="configuration"
        >
          <slot></slot>
        </k-configuration>
      </c-resizable>

    </div>
  </div>
</template>


<script>
import KConfiguration from './k-configuration.vue';
import ViewportContainer from './viewport-container.vue';
import KProject from '../project/k-project.vue';


export default {
  name: 'k-trifold',
  data() {
    return {
      singleColumnView: false,
      maxDrawingWidth: undefined,
    };
  },
  components: {
    KConfiguration,
    ViewportContainer,
    KProject,
  },
  methods: {
    resizeHandler() {
      if (this.$refs.configuration) {
        this.singleColumnView = this.$refs.configuration.$el.clientWidth <= 800;
      }

      if (this.$refs.trifold) {
        this.maxDrawingWidth = this.$refs.trifold.clientWidth - (240 + 400); // (k-project + k-configuration)
      }
    },
  },
  mounted() {
    new ResizeObserver(this.resizeHandler).observe(this.$refs.configuration.$el);
  },
};
</script>
