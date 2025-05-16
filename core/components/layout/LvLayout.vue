<template>
  <div class="h-full flex flex-col text-sm">
    <LvReadOnlyBanner v-if="host?.meta.isReadOnly" />
    <div
      v-if="appVersionsHaveMismatch"
      class="flex w-full h-fit p-2 bg-steel-light justify-center items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="text-warning w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>

      <span class="pl-3"
        >{{ $l('warning_app_mismatch') }}
        <RouterLink to="/release-notes" class="font-bold lowercase">
          {{ $l('release_notes') }} </RouterLink
        >.</span
      >
    </div>
    <div class="max-h-full flex flex-grow divide-x">
      <LvProjectPanel>
        <ProjectRoot />
      </LvProjectPanel>

      <div class="flex-1 relative">
        <Transition
          enter-from-class="-translate-y-4 opacity-0"
          leave-to-class="-translate-y-4 opacity-0"
        >
          <div
            v-if="globalMessage"
            class="absolute z-30 bg-danger text-white py-3 px-4 inset-x-4 top-4 rounded transition">
            {{ globalMessage }}
          </div>
        </Transition>

        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRootStore, useLeviateStore } from '@crhio/leviate';

import ProjectRoot from '@/components/project/ProjectRoot.vue';
import { LvProjectPanel } from '../';
import LvReadOnlyBanner from './LvReadOnlyBanner.vue'

const appVersionsHaveMismatch = ref(false);

const globalMessage = computed(() => useLeviateStore().globalMessage);

onMounted(async () => {
  appVersionsHaveMismatch.value = await useRootStore().detectAppVersionMismatch;
});
</script>
