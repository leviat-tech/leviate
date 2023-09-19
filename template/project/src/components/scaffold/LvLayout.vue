<template>

  <div class="h-full flex flex-col text-sm">
    <div class="flex flex-grow">

      <LvProjectPanel />

      <LvProjectExplorer>

        <template #toolbar>
          <TheProjectExplorerToolbar />
        </template>

        <TheProjectExplorerContent />

      </LvProjectExplorer>

      <div class="flex-1">
        <slot />
      </div>

    </div>
  </div>

</template>


<script setup>
import LvProjectExplorer from '@/components/scaffold/LvProjectExplorer.vue';
import TheProjectExplorerToolbar from '@/components/project/TheProjectExplorerToolbar.vue';
import TheProjectExplorerContent from '@/components/project/TheProjectExplorerContent.vue';

import { LvProjectPanel } from '@crhio/leviate/components'
</script>
