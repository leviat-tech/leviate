<template>
  <LvLayout>
    <div class="flex h-full relative">
      <div class="border-r w-[450px]">
        <LvImportFileSelect />
        <LvImportTree/>
      </div>

      <div class="w-full flex flex-col relative">
        <LvImportToolbar @importShapes="$emit('importShapes', selectedShapes)" />
        <LvImportShapes/>
      </div>
    </div>
  </LvLayout>
</template>

<script setup>
import LvLayout from '../layout/LvLayout.vue';
import LvImportTree from './LvImportTree.vue';
import LvImportShapes from './LvImportShapes.vue';
import useShapeSelect from '../../composables/useShapeSelect';
import LvImportToolbar from './LvImportToolbar.vue';
import LvImportFileSelect from './LvImportFileSelect.vue';

defineEmits(['importShapes']);

const { selectedShapes } = useShapeSelect();

</script>
