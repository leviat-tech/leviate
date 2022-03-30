<style scoped lang="scss">
  $primary: lighten($primary, 10%);
  .project {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0px 0px 0.5rem 0rem;
    background-color: $color-gray-02;

    .title {
      padding: $standard-indent;
      font-weight: bold;
    }
  }
</style>


<template>
  <div class="project h-full">
    <explorer-toolbar class="center"/>
    <div class="v-box justify-between">
      <div>
        <div class="title h-box flex-limit items-center">
          Project Explorer
        </div>
      </div>

      <div>
        <div class="title h-box flex-limit items-center">
          Release
        </div>


      </div>
    </div>
  </div>
</template>


<script>

import ExplorerToolbar from '../toolbar/explorer-toolbar.vue';

export default {
  name: 'Project',
  components: {
    ExplorerToolbar,
  },
};
</script>
