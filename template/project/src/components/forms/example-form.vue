<template v-if="entity">
  <CText-input :id="getEntityId('name')" label="Name" v-model="entity.name" />
  <CNumeric-input :id="getEntityId('width')" label="Width" v-model="entity.width" />
  <CNumeric-input :id="getEntityId('height')" label="Height" v-model="entity.height" />
  <CNumeric-input :id="getEntityId('depth')" label="Depth" v-model="entity.depth" />
</template>


<script setup>
import useCurrentEntity from '@/composables/useCurrentEntity';

const entity = useCurrentEntity();
const getEntityId = (path) => [entity.value.constructor.id, entity.value.id, path].join('_');
</script>
