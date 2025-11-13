<template>
  <div class="flex flex-col h-full w-full overflow-hidden">
    <div class="relative w-full h-full">
      <div class="w-full h-full overflow-hidden flex flex-col">
        <LvReadOnlyBanner v-if="host?.meta.isReadOnly" />
        <LvMismatchBanner v-if="appVersionsHaveMismatch" />
        <div class="max-h-full flex flex-grow divide-x w-full divide-base-300 overflow-hidden">
          <LvProjectPanel>
            <ProjectRoot />
          </LvProjectPanel>
          <div class="flex-1 flex flex-col">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRootStore } from '@crhio/leviate';

import ProjectRoot from '@/components/project/ProjectRoot.vue';
import { LvProjectPanel } from '../';
import LvReadOnlyBanner from './LvReadOnlyBanner.vue'
import LvMismatchBanner from './LvMismatchBanner.vue'

const appVersionsHaveMismatch = ref(false);

onMounted(async () => {
  appVersionsHaveMismatch.value = await useRootStore().detectAppVersionMismatch;
});
</script>
