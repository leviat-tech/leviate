<template>
  <LvViewport>
    <template #toolbar>
      <TheViewportToolbar />
    </template>

    <TheViewportDrawing />
  </LvViewport>
</template>


<script setup>
import TheViewportToolbar from './TheViewportToolbar.vue';
import TheViewportDrawing from './TheViewportDrawing.vue';
import LvViewport from '@/components/scaffold/LvViewport.vue';
</script>
