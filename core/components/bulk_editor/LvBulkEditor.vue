<template>
  <LvLayout v-if="entities.length > 0">
    <!--    <LvBulkEditTable :entities="entities" :model="model"  :config="config" />-->
    <!--    <LvBulkAddView-->
    <!--      :layers="layers"-->
    <!--    >-->
    <!--      <template #input>-->
    <!--        <slot name="input" />-->
    <!--      </template>-->
    <!--    </LvBulkAddView>-->
    <LvBulkEditPropertyTreeView @submit="onBulkUpdate">
      <template #select-entities>
        <slot name="select-entities"/>
      </template>

      <template #input>
        <slot name="input"/>
      </template>
    </LvBulkEditPropertyTreeView>
  </LvLayout>
</template>

<script setup lang="ts" generic="T extends BaseModel">
import { computed, provide, reactive } from 'vue';
import type { InjectionKey } from 'vue';
import LvLayout from '../../components/layout/LvLayout.vue';
import BaseModel from '../../BaseModel';
import { useRouter } from 'vue-router';
import LvBulkEditPropertyTreeView from './LvBulkEditPropertyTreeView.vue';
import { BulkEditor } from './composables/useBulkEdit';

type AvailableFieldTypes = 'text' | 'number' | 'select';
type ConfigFieldBase = Record<string, AvailableFieldTypes>;
type ConfigField = Record<string, ConfigFieldBase | AvailableFieldTypes>;
type Config = {
  supportedProperties: Record<string, ConfigField>;
  blacklistedProperties: string[];
};

const props = defineProps<{
  layers: any[];
  model: typeof BaseModel;
  modelDefaults: any;
  config: Config;
}>();

const entities = computed<BaseModel[]>(() => props.model.read());

if (entities.value.length === 0) {
  useRouter().replace('/');
}

const emit = defineEmits(['create']);

const BULK_ENTITY_ID = '$BulkEntity$';

const bulkEditor = reactive({
  config: props.config,
  events: {
    onCreate: (data: any) => emit('create', data),
  },
  bulkEntity: props.model.find(BULK_ENTITY_ID) || props.model.create({
    id: BULK_ENTITY_ID,
    ...props.modelDefaults
  }),
});

provide(BulkEditor, bulkEditor);

function onBulkUpdate(e) {
  console.log(12354, e);
}
</script>
