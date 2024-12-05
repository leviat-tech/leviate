<template>
  <div class="import__toolbar relative z-10 bg-gray-50 h-12 border-b flex items-center justify-between px-1">

    <template v-if="shapes.length > 0">
      <div class="flex items-center pl-2">

        <div>
          <CListbox :options="unitOptions" v-model="shapeUnits" label="import_select_units" class="[&>button]:w-32"/>
        </div>
        <div class="pl-4">
          <CListbox :options= "precisionOptions" v-model="shapeUnitPrecision" label="import_select_precision"/>
        </div>
      </div>

      <CButton @click="importShapes" color="sky" :disabled="!selectedShapes?.length">
        <div>Import</div>
        <div class="w-6">{{ selectedCountText }}</div>
      </CButton>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import useShapeSelect from '../../composables/useShapeSelect';

const emit = defineEmits(['importShapes']);

const { shapes, selectedShapes, shapeUnits, shapeUnitPrecision, getFormattedShapes } = useShapeSelect();

const unitOptions = ['m', 'cm', 'mm', 'ft', 'in'];
const precisionOptions = [0, 1, 2, 3, 4];

const selectedCountText = computed(() => {
  const selectedCount = selectedShapes.value?.length;

  return selectedCount ? `(${selectedCount})` : '';
});


function importShapes() {
  const shapesToImport = getFormattedShapes();

  emit('importShapes', shapesToImport);
}
</script>

<style>
.import__toolbar .concrete__listbox {
  width: 4.5rem;
}
</style>
