<template>
  <LvImport @importShapes="onImportShapes"/>
</template>

<script setup>
import LvImport from '@crhio/leviate/components/import/LvImport.vue'

const onImportShapes = (shapes) => {
  console.log('IMPORT THESE!!!', shapes);
}

</script>
