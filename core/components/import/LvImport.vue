<template>
  <LvLayout>
    <div class="flex h-full relative">
      <div class="border-r w-[450px]">
        <div v-if="title" class="px-4 pt-4 text-lg font-bold text-sky-dark">{{ title }}</div>
        <LvImportFileSelect />
        <LvImportTree />
      </div>

      <div class="w-full flex flex-col relative">
        <LvImportToolbar @importShapes="$emit('importShapes', $event)" />
        <LvImportShapes />
      </div>
    </div>
  </LvLayout>
</template>

<script setup lang="ts">
import LvLayout from '../layout/LvLayout.vue';
import LvImportTree from './LvImportTree.vue';
import LvImportShapes from './LvImportShapes.vue';
import LvImportToolbar from './LvImportToolbar.vue';
import LvImportFileSelect from './LvImportFileSelect.vue';

withDefaults(
  defineProps<{
    title: string;
  }>(),
  {
    title: '',
  }
);

defineEmits(['importShapes']);
</script>
