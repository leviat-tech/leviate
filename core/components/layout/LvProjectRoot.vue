<template>
  <LvProjectPanelItem v-for="(component, name) in projectPanelItemsMap" :key="name" :name="name">
    <component :is="component" />
  </LvProjectPanelItem>
</template>

<script setup lang="ts">
  import { LvProjectPanelItem } from '@crhio/leviate/components';

  defineProps({
    projectPanelItemsMap: Object,
  });
</script>
