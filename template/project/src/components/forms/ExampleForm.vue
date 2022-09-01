<template v-if="entity">
  <CFormSection title="Config">
    <div class="grid gap-y-4 py-4">
      <CTextInput :id="getEntityId('name')" />
      <CNumericInput :id="getEntityId('width')" :step="10"/>
      <CNumericInput :id="getEntityId('height')" :step="10"/>
      <CNumericInput :id="getEntityId('depth')" :step="10"/>
    </div>
  </CFormSection>s
</template>


<script setup>
import useCurrentEntity from '@/composables/useCurrentEntity';

const entity = useCurrentEntity();
const getEntityId = (path) => [entity.value.id, path].join('_');
</script>
