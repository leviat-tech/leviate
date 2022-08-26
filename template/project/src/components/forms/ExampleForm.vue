<template v-if="entity">
  <CFormSection title="Config">
    <div class="grid gap-y-4 py-4">
      <CTextInput :id="getEntityId('name')" label="Name"/>
      <CNumericInput :id="getEntityId('width')" label="Width" :step="10"/>
      <CNumericInput :id="getEntityId('height')" label="Height" :step="10"/>
      <CNumericInput :id="getEntityId('depth')" label="Depth" :step="10"/>
    </div>
  </CFormSection>
</template>


<script setup>
import useCurrentEntity from '@/composables/useCurrentEntity';

const entity = useCurrentEntity();
const getEntityId = (path) => [entity.value.constructor.id, entity.value.id, path].join('_');
</script>
