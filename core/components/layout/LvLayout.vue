<template>

  <div class="h-full flex flex-col text-sm">
    <div class="max-h-full flex flex-grow">

      <LvProjectPanel>
<!--        <LvProjectExplorer>-->

<!--          <template #toolbar>-->
<!--            <TheProjectExplorerToolbar />-->
<!--          </template>-->

<!--          <TheProjectExplorerContent />-->

<!--        </LvProjectExplorer>-->

        <ProjectContent />


      </LvProjectPanel>
<!---->
<!--      <div class="flex-1">-->
<!--        <slot />-->
<!--      </div>-->
    </div>
  </div>

</template>


<script setup>
import ProjectContent from '@/components/project/ProjectContent.vue';
import TheProjectExplorerToolbar from '@/components/project/TheProjectExplorerToolbar.vue';
import TheProjectExplorerContent from '../../../template/project/src/components/project/ProjectExplorer.vue';

import { LvProjectPanel, LvProjectPanelItem } from '../index.js';
import LvVersions from './project/LvVersions.vue';
</script>
