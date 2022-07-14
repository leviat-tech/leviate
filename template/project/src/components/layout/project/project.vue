<style scoped lang="scss">
  .project {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 240px;

    .title {
      padding: 1rem;
      font-weight: bold;
    }
  }
</style>


<template>
  <div class="project h-full pb-2 bg-gray-200">
    <explorer-toolbar class="center"/>
    <div class="v-box justify-between">
      <div>
        <div class="title h-box flex-limit items-center p-4">
          Project Explorer
        </div>
      </div>

      <div>
        <div class="title h-box flex-limit items-center p-4">
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
