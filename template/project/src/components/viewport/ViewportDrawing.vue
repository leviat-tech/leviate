<template>
  <CViewportContainer
    v-model="maximizedViewport"
    :options="['top', 'bottom']"
    :aspect-ratio="2"
  >
    <CViewport
      v-model="topViewport"
      viewport-id="top"
      :options="[{ label: 'Top View', value: 'top' }]"
    >
      <DrawingTop :entity="entity"></DrawingTop>
    </CViewport>

    <CViewport
      v-model="bottomViewport"
      viewport-id="bottom"
      :options="[{ label: 'Side View', value: 'bottom' }]"
    >
      <DrawingSide :entity="entity"></DrawingSide>
    </CViewport>

  </CViewportContainer>
</template>


<script setup>
import { ref } from 'vue';
import DrawingTop from './drawings/DrawingTop.vue';
import DrawingSide from './drawings/DrawingSide.vue';
import useCurrentEntity from '@/composables/useCurrentEntity';


const entity = useCurrentEntity();

const maximizedViewport = ref(null);
const topViewport = ref('top');
const bottomViewport = ref('bottom');
</script>
