<template>
  <LvPanel :expanded="300" :collapsed="70" panelId="project" class="flex-none">
      <LvProjectToolbar />
      <div class="bg-red-300 flex-1 flex flex-col">
        <div class="flex-1 flex flex-col divide-y">
          <LvProjectPanelItem name="versions">
            <LvVersions />
          </LvProjectPanelItem>
          <slot />
        </div>
      </div>
  </LvPanel>
</template>

<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLeviateStore } from '@crhio/leviate/store/leviate.js';

import LvPanel from '../ui/LvPanel.vue';
import LvProjectPanelItem from './project/LvProjectPanelItem.vue';
import LvVersions from './project/LvVersions.vue';
import LvProjectToolbar from './project/LvProjectToolbar.vue';

const route = useRoute();
const leviate = useLeviateStore();

watch(
  () => route.query.projectTab,
  (tabName) => {
    leviate.setActiveProjectItem(!tabName ? 'design' : tabName);
  },
  { immediate: true }
);
</script>
