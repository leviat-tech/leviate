<template>
  <div class="h-full flex">
    <CResizable class="flex w-full">
      <CPane class="border-r-2 border-steel h-full overflow-y-auto" primary :min="'500px'">
        <div>
          <CFormSection :title="$L('bulk_add')" class="p-4">
            <LvBulkAddLayersSelector v-if="layers" :layers="layers" />
            <LvBulkAddModels :defaultQty="1" :parameters="parameters" :method="modelCreateMethod" />
          </CFormSection>
        </div>
      </CPane>
      <CPane class="relative h-full flex-row overflow-y-auto" :min="'515px'">
        <div class="absolute inset-y-0 left-0 flex items-center">
          <slot name="input">the bulk entity inputs for defaults go here</slot>
        </div>
      </CPane>
    </CResizable>
  </div>
</template>

<script setup>
import LvBulkAdd from './add/LvBulkAdd.vue';
import LvBulkAddModels from './add/LvBulkAddModels.vue';
import LvBulkAddLayersSelector from './add/LvBulkAddLayersSelector.vue';


const props = defineProps({
  layers: Object,
  model: Object,
  modelDataFormatterMethod: Function,
  modelDataFormatterMethodParameters: Object,
  modelCreateMethod: Function,
  modelDataFormatted: Object,
});
</script>
