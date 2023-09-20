<template>
  <div class="h-full flex flex-col text-sm">
    <div class="max-h-full flex flex-grow">

      <LvProjectPanel>
        <ProjectContent />
      </LvProjectPanel>

      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>


<script setup>
import ProjectContent from '@/components/project/ProjectContent.vue';
import { LvProjectPanel } from '../';
</script>
