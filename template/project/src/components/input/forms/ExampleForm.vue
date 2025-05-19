<template v-if="entity">
  <CFormSection title="Config">
    <div class="grid gap-y-4 py-4">
      <CTextInput :id="getEntityId('name')" />
      <CTextInput :id="getEntityId('entityStatus')" />
      <CNumericInput :id="getEntityId('width')" :step="10" unit="m"/>
      <CNumericInput :id="getEntityId('height')" :step="10"/>
      <CNumericInput :id="getEntityId('depth')" :step="10"/>
      <CListbox :id="getEntityId('color.top')" />
      <CListbox :id="getEntityId('color.side')" />
      <CSwitch :id="getEntityId('hasBorder')" label="border" color="success" size="sm"/>
    </div>
  </CFormSection>
</template>


<script setup>

import { useRouter } from 'vue-router';
import useCurrentEntity from '@/composables/useCurrentEntity';

const router = useRouter();
const entity = useCurrentEntity();
const getEntityId = (path) => [entity.value.id, path].join(':');

</script>
