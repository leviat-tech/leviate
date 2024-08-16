<template>
  <div class="viewport relative flex flex-col flex-1 h-full">
    <div class="flex flex-none w-full items-center h-12 px-1 border-b">
      <ViewportToolbar />
    </div>
    <ViewportDrawing />
    <LvValidationPane :messages="messageStore.configErrors" auto-appear/>
  </div>
</template>


<script setup>
import ViewportToolbar from './ViewportToolbar.vue';
import ViewportDrawing from './ViewportDrawing.vue';
import { LvValidationPane } from '@crhio/leviate/components';
import { useMessageStore } from '@crhio/leviate';

const messageStore = useMessageStore();

// setTimeout(() => {
//
// messageStore.setConfigError('This is a calculation error message')
// messageStore.setConfigWarning('This is a calculation error warning')
// }, 2000);
</script>
