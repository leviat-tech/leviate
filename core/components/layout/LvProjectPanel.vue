<template>
  <LvPanel :expanded="300" :collapsed="70" panelId="project" class="flex-none">
    <div class="h-full flex flex-col justify-start bg-gray-50">
      <LvProjectToolbar />

      <LvProjectPanelItem name="versions">
        <LvVersions />
      </LvProjectPanelItem>

      <slot />

      <div v-if="leviate.panels.project.isExpanded" class="flex-1 bg-gray-200 mx-1 -mt-px mb-1" />
    </div>
  </LvPanel>
</template>

<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLeviateStore } from '@crhio/leviate/store/leviate.ts';

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
