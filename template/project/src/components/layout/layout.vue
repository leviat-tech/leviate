<style scoped lang="scss">
  $border: 1px solid $color-gray-04;

  .layout {
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


  <div class="layout">
    <div class="h-box">

      <div class="flex flex-col flex-grow">

        <div class="h-box flex">

          <div class="project flex-limit v-box scroll">
            <project/>
          </div>

          <slot></slot>

        </div>
      </div>

    </div>
  </div>

</template>


<script>
import Project from './project/project.vue';

export default {
  name: 'Layout',
  components: {
    Project,
  },
};
</script>
