<template>
  <LvBulkEditTable :config="config" :model="model" :entities="entities" />
</template>
<script setup lang="ts">
// import { LvBulkEditTable } from '@crhio/leviate/components';
import LvBulkEditTable from './edit/LvBulkEditTable.vue';

type Position = {
  id: string;
  name: string;
  data: Record<string, any>;
};

const props = defineProps<{
  entities: Array<Position>;
  model: unknown;
  config: Record<string, unknown>;
}>();
</script>
