<template>
  <div class="viewport flex flex-col flex-1 h-full">
    <div class="flex flex-none w-full items-center h-12 px-1 border-b">
      <ViewportToolbar />
    </div>
    <ViewportDrawing />
    <LvValidationPane />
  </div>
</template>


<script setup>
import ViewportToolbar from './ViewportToolbar.vue';
import ViewportDrawing from './ViewportDrawing.vue';
import { LvValidationPane } from '@crhio/leviate/components'
</script>
