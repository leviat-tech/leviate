<template>
  <div class="ml-8">
    <div class="flex items-center">
      <CStatusIndicator :status="props.position.status" />
      <CCheckbox
        v-model="isSelected"
        no-wrap
        size="xs"
        :disabled="!isCalculated"
        @change="handleSelectPosition()"
      />
      <label class="text-xs font-semibold px-1 pl-2">{{ positionName }}</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import STATUSES from '@crhio/concrete/src/components/Status/statuses';
import { computed, inject } from 'vue';

const props = defineProps<{
  layer: any;
  position: any;
}>();

const positionModel = inject('positionModel');

const isCalculated = computed(() => {
  return positionModel?.find(props.position.id).status !== STATUSES.NO_STATUS;
});

const positionName = computed(() => {
  return props.position.custom_name || props.position.name;
});

const { selectedPositionIds, addId, removeId } = inject('selectedPositionIds');

const isSelected = computed({
  get() {
    return selectedPositionIds.value.has(props.position.id);
  },
  set(wasSelected) {
    if (wasSelected) {
      removeId(props.position.id);
      return;
    }

    if (isCalculated.value) {
      addId(props.position.id);
    }
  },
});

const handleSelectPosition = () => {
  if (selectedPositionIds.value.has(props.position.id)) {
    removeId(props.position.id);

    return;
  }

  addId(props.position.id);
};
</script>
