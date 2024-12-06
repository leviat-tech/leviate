<template>
  <LvImport @importShapes="onImportShapes" :title="$l('import_title')" />
</template>

<script setup>
import LvImport from '@crhio/leviate/components/import/LvImport.vue'

const onImportShapes = (shapes) => {
  console.log('IMPORT THESE!!!', shapes);
}

</script>
