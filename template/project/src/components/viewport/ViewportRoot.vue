<template>
  <div class="viewport flex flex-col flex-1 h-full">
    <div class="flex flex-none w-full items-center h-12 px-1 border-b">
      <ViewportToolbar />
    </div>
    <ViewportDrawing />
    <LvValidationPane :messages="messages"/>
  </div>
</template>


<script setup>
import ViewportToolbar from './ViewportToolbar.vue';
import ViewportDrawing from './ViewportDrawing.vue';
import { LvValidationPane } from '@crhio/leviate/components'

const messages = [
  {
    text: 'Error notification.',
    type: 'error',
  },
  {
    text: 'Dismisable warning notification',
    type: 'warning',
  },
  {
    text: 'Another Error notification.',
    type: 'error',
  },
  {
    text: 'Another dismisable warning notification',
    type: 'warning',
  },
  {
    text: 'Error notification 3.',
    type: 'error',
  }
]
</script>
