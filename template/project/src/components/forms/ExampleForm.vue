<template v-if="entity">
  <CFormSection title="Config">
    <div class="grid gap-y-4 py-4">
      <CTextInput :id="getEntityId('name')">
        <CInputAffix v-slot:prefix type="suffix">mm</CInputAffix>
      </CTextInput>
      <CNumericInput :id="getEntityId('width')" :step="10" unit="m"/>
      <CNumericInput :id="getEntityId('height')" :step="10"/>
      <CNumericInput :id="getEntityId('depth')" :step="10"/>
      <CListbox :id="getEntityId('color.top')" :options="colorOptions" />
      <CListbox :id="getEntityId('color.side')" :options="colorOptions" />
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

const colorOptions = entity.value.coercedSchema.reach('color.top').options();

</script>
