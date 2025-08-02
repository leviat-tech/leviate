<template>
  <CFormSection :title="$L('bulk_add')" class="p-4">
    <LvBulkAddLayersSelector v-if="layersLists" :layersLists="layersLists" />
    <LvBulkAddModels :defaultQty="1" :parameters="parameters" :method="modelCreateMethod" />
  </CFormSection>
</template>

<script setup>
import { computed } from 'vue';
import LvBulkAddModels from './LvBulkAddModels.vue';
import LvBulkAddLayersSelector from './LvBulkAddLayersSelector.vue';

const props = defineProps({
  layersLists: Object,
  model: Object,
  modelDataFormatterMethod: Function,
  modelDataFormatterMethodParameters: Object,
  modelCreateMethod: Function,
  modelDataFormatted: Object,
});

// with layers:
// required
//  - layersLists
//  - model
//  - modelDataFormatterMethod
//  - modelDataFormatterMethodParameters
//  - modelCreateMethod

// no layers and preformatted data:
// required
//  - model
//  - modelCreateMethod
//  - modelDataFormatted

// no layers and formatted data methods:
// required
//  - model
//  - modelDataFormatterMethod
//  - modelDataFormatterMethodParameters
//  - modelCreateMethod

const dataFormatted = computed(() => {
  const { modelDataFormatterMethodParameters, modelDataFormatterMethod, modelDataFormatted } =
    props;
  if (modelDataFormatterMethodParameters && modelDataFormatterMethod) {
    return modelDataFormatterMethod(...modelDataFormatterMethodParameters);
  }
  return modelDataFormatted;
});

const parameters = computed(() => {
  return [props.model, dataFormatted.value];
});
</script>
