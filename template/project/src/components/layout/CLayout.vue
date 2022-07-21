<template>

  <div class="h-full flex flex-col text-sm">
    <div class="flex flex-grow">

      <c-project-explorer>
        <template #toolbar>
          <lv-explorer-toolbar />
        </template>
        <div>Project explorer content here</div>
        <template #footer>Project explorer footer content here</template>
      </c-project-explorer>

      <slot></slot>

    </div>
  </div>

</template>


<script setup>
import LvExplorerToolbar from './project/LvExplorerToolbar.vue';
import CProjectExplorer from './project/CProjectExplorer.vue';
</script>
