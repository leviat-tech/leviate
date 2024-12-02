<template>
  <div class="absolute inset-0 overflow-y-auto">
    <div class="m-8 flex flex-wrap items-start content-start gap-4 pt-12">
      <LvImportShapeItem v-for="(shape, i) in shapes" :key="i" :shape="shape" />
    </div>
  </div>
</template>

<script setup>
import LvImportShapeItem from './LvImportShapeItem.vue';
import useShapeSelect from '../../composables/useShapeSelect';

const { shapes } = useShapeSelect();
</script>
