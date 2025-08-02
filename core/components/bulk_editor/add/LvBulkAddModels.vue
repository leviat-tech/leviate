<template>
  <div class="w-72">
    <CNumericInput v-model="modelQty" label="qty_positions_new" />
    <CButton :title="$L('add new')" @click="createModels">
      <CIcon type="plus" size="sm" />
      Add New
    </CButton>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  defaultQty: Number,
  parameters: Object,
  method: Function,
});
const modelQty = ref(props.defaultQty);

const createModels = () => {
  const { parameters, method } = props;
  for (let i = 0; i < modelQty.value; i++) {
    method(...parameters);
  }
};
</script>
