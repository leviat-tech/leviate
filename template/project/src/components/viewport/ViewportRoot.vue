<template>
  <div class="viewport relative flex flex-col flex-1 h-full">
    <div class="flex flex-none w-full items-center h-12 px-1 border-b">
      <ViewportToolbar />
    </div>
    <ViewportDrawing />
    <LvValidationPane :messages="messages" @dismiss="entity.deleteError($event)" />
  </div>
</template>


<script setup>
import ViewportToolbar from './ViewportToolbar.vue';
import ViewportDrawing from './ViewportDrawing.vue';
import { LvValidationPane } from '@crhio/leviate/components';
import { useRootStore } from '@crhio/leviate';
import { computed } from 'vue';

const rootStore = useRootStore();

const entity = computed(() => rootStore.currentEntity);

const messages = [
  { type: 'success', timestamp: 1738951249000, content: 'Entity 1011: Successfully generated product' },
  { type: 'magic', timestamp: 1738951231000, content: 'Entity 1011: Calculating product' },
  { type: 'unknown', timestamp: 1738951231000, content: 'Configuration Loaded' },
  { type: 'warning', timestamp: 1738951249000, content: 'Entity 1011: Successfully generated product' },
  { type: 'danger', timestamp: 1738951231000, content: '<b>Entity 1011:</b> Calculating product' },
  { type: 'info', timestamp: 1738951231000, content: 'Configuration Loaded', isDismissable: true },
  { timestamp: 1738951231000, content: 'Configuration Loaded' },
  { content: 'Configuration Loaded' },
  { },
]


</script>
