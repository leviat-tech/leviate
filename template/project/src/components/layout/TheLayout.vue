<template>

  <div class="h-full flex flex-col text-sm">
    <div class="flex flex-grow">

      <c-project-explorer>

        <template #toolbar>
          <lv-explorer-toolbar />
        </template>

        <div class="px-4">Project explorer content here</div>

        <the-project-explorer-content />


        <template #footer>
          <div class="p-4">Project explorer footer content here</div>
        </template>

      </c-project-explorer>

      <div class="flex-1">
        <slot></slot>
      </div>

    </div>
  </div>

</template>


<script setup>
import LvExplorerToolbar from './project/LvExplorerToolbar.vue';
import CProjectExplorer from './project/CProjectExplorer.vue';
import TheProjectExplorerContent from './project/TheProjectExplorerContent.vue';
</script>
