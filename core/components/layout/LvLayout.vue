<template>
  <div class="h-full flex flex-col text-sm">
    <div class="max-h-full flex flex-grow divide-x">

      <LvProjectPanel>
        <ProjectRoot />
      </LvProjectPanel>

      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>


<script setup>
import ProjectRoot from '@/components/project/ProjectRoot.vue';
import { LvProjectPanel } from '../';
</script>
