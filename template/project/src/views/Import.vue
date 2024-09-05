<template>
  <LvLayout>
    <div class="h-full flex items-center justify-center">
       {{ $l('import') }}
       <ImportTest />
    </div>
  </LvLayout>
</template>

<script setup>
import LvLayout from '@crhio/leviate/components/layout/LvLayout.vue';
import ImportTest from '@crhio/leviate/components/import/test.vue';
</script>
