<template>
  <div class="px-4 mt-6 border-r">
    <LvPropertyTreeView v-for="obj in propObjs" :key="obj.name" :prop-obj="obj" class="mb-2" />
    <CButton
      class="mt-14"
      variant="primary"
      :disabled="propsSelected.length === 0"
      @click="applyUpdate"
    >
      {{ $l('update_values__of_selected_positions') }}
    </CButton>
  </div>
</template>

<script setup>
import LvPropertyTreeView from '../common/LvPropertyTreeView.vue';
import useSelectedProperties from '../composables/useSelectedProperties.ts';

const props = defineProps({
  config: Object,
  layerModel: Object,
  positionModel: Object,
  positionModelDefaults: Object,
  propObjs: Object,
  applyUpdate: Function,
});

const propsSelected = useSelectedProperties();
</script>
