<template>
  <LvProjectPanelItem
    v-for="(component, name) in projectPanelItemsMap"
    :key="name"
    :name="name"
  >
    <component :is="component" />
  </LvProjectPanelItem>
</template>

<script setup>
import { LvProjectPanelItem } from '@crhio/leviate/components'
import ProjectInfo from './ProjectInfo.vue';
import ProjectSettings from './ProjectSettings.vue';
import ProjectOutput from './ProjectOutput.vue';
import ProjectDesign from './ProjectDesign.vue';

const projectPanelItemsMap = {
  info: ProjectInfo,
  settings: ProjectSettings,
  design: ProjectDesign,
  output: ProjectOutput,
};

</script>
