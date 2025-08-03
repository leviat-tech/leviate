<template>
  <div>Hello from Leviate</div>
  <div class="h-full flex">
    <CResizable class="flex w-full">
      <CPane class="border-r-2 border-steel h-full overflow-y-auto" primary :min="'300px'">
        <div class="px-4 border-r">
          <slot name="models_selector">the position selection checkbox tree goes here</slot>
        </div>
      </CPane>
      <CPane class="border-r-2 border-steel h-full flex-row overflow-y-auto">
        <LvBulkEditPropertyTree :config="config" :propObjs="propObjs" :updateMethod="updateMethod" />
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
import LvBulkEditPropertyTree from './edit/LvBulkEditPropertyTree.vue';

const props = defineProps({
  config: Object,

  positionModel: Object,
  positionModelDefaults: Object,

  propObjs: Object,
  updateMethod: Function,
});
</script>
