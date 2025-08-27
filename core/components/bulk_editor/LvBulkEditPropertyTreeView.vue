<template>
  <div class="h-full flex" v-if="bulkEdit.bulkEntity">
    <CResizable class="flex w-full">
      <CPane class="border-r-2 border-steel h-full overflow-y-auto" primary :min="'300px'">
        <div class="px-4 border-r">
          <slot name="select-entities">the position selection checkbox tree goes here</slot>
        </div>
      </CPane>
      <CPane class="border-r-2 border-steel h-full flex-row overflow-y-auto">
        <LvBulkEditPropertyTree :config="config" :propObjs="propObjs" :updateMethod="updateMethod" />
      </CPane>
      <CPane class="h-full flex-row overflow-y-auto" :min="'515px'">
        <div class="">
          <slot name="input">the bulk entity inputs for defaults go here</slot>
        </div>
      </CPane>
    </CResizable>
  </div>
</template>

<script setup>
import LvBulkEditPropertyTree from './edit/LvBulkEditPropertyTree.vue';
import { getPropTree } from './utils';
import { computed } from 'vue';
import useBulkEdit from './composables/useBulkEdit';
import { omit } from 'lodash-es';

const props = defineProps({
  config: Object,

  positionModel: Object,
  positionModelDefaults: Object,

  updateMethod: Function,
});

const bulkEdit = useBulkEdit();
const propObjs = computed(() => {
  const { bulkEntity, config } = bulkEdit;

  console.log(bulkEntity)

  if (!bulkEntity) return {};

  const defaultEntity = omit(bulkEntity.$toJSON(), config.blacklistedProperties);
  return getPropTree(defaultEntity);
})
</script>
