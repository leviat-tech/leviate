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
import { computed } from 'vue';

const messages = [
  {
    text: 'Error notification.',
    type: 'error',
    isDismissable: false,
  },
  {
    text: 'Dismisable warning notification',
    type: 'warning',
    onClick: () => doSomething(),
    isDismissable: true,
  },
  {
    text: 'Another Error notification.',
    type: 'error',
    onClick: () => doSomething(),
    isDismissable: false,
  },
  {
    text: 'Another dismisable warning notification',
    type: 'warning',
    isDismissable: true,
  },
  {
    text: 'Error notification.',
    type: 'error',
    onClick: () => doSomething(),
    isDismissable: false,
  }
]

const doSomething = () => { console.log('test') }

</script>
