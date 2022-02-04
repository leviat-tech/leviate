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

  .project {
    flex: none;
    max-width: 240px;
    min-width: 240px;
    border-right: $border;
  }

  .project, .contents {
    border-right: $border;
  }

</style>


<template>


  <div class="k-layout">
    <div class="h-box">

      <div class="flex flex-col flex-grow">

        <div class="h-box flex">

          <div class="project flex-limit v-box scroll">
            <k-project/>
          </div>

          <slot></slot>

        </div>
      </div>

    </div>
  </div>

</template>


<script>
import KProject from './project/k-project.vue';

export default {
  name: 'k-layout',
  components: {
    KProject,
  },
};
</script>
