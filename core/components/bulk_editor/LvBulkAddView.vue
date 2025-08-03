<template>
  <div class="h-full flex">
    <CResizable class="flex w-full">
      <CPane class="border-r-2 border-steel h-full overflow-y-auto" primary :min="'500px'">
        <div>
          <LvBulkAdd
            :layersLists="layersLists"
            :model="model"
            :modelDataFormatterMethod="modelDataFormatterMethod"
            :modelDataFormatterMethodParameters="modelDataFormatterMethodParameters"
            :modelCreateMethod="modelCreateMethod"
          />
        </div>
      </CPane>
      <CPane class="h-full flex-row overflow-y-auto" :min="'515px'">
        <div class="my-6 px-4">
          <slot name="model_inputs">the bulk entity inputs for defaults go here</slot>
        </div>
      </CPane>
    </CResizable>
  </div>
</template>

<script setup>
import LvBulkAdd from './add/LvBulkAdd.vue';

const props = defineProps({
  layersLists: Object,
  model: Object,
  modelDataFormatterMethod: Function,
  modelDataFormatterMethodParameters: Object,
  modelCreateMethod: Function,
  modelDataFormatted: Object,
});
</script>
