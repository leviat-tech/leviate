<template>
  <LvPanel :expanded="300" :collapsed="70" panelId="project">
    <div class="h-full flex flex-col justify-start bg-gray-50">
      <LvProjectToolbar />

      <LvProjectPanelItem name="versions">
        <LvVersions/>
      </LvProjectPanelItem>

      <slot />

      <div class="flex-1 bg-gray-200 mx-1 -mt-px mb-1" />
    </div>
  </LvPanel>
</template>

<script setup>
import { watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useLeviateStore } from '@crhio/leviate/store/leviate.js';

import LvPanel from '../ui/LvPanel.vue';
import LvProjectPanelItem from './project/LvProjectPanelItem.vue';
import LvVersions from './project/LvVersions.vue';
import LvProjectToolbar from './project/LvProjectToolbar.vue';

const route = useRoute();
const leviate = useLeviateStore();

watch(() => route.query.projectTab, tabName => {
  leviate.setActiveProjectItem(tabName);
}, { immediate: true });
</script>
