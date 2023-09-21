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
import ProjectExplorer from './ProjectExplorer.vue';

const projectPanelItemsMap = {
  info: ProjectInfo,
  settings: ProjectSettings,
  explorer: ProjectExplorer,
  output: ProjectOutput,
};

</script>
