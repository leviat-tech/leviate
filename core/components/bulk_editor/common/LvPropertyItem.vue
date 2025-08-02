<template>
  <div class="ml-8 mt-2">
    <div class="flex items-center">
      <CCheckbox v-model="isSelected" no-wrap @change="handleSelectPosition" />
      <button class="text-xs font-semibold px-1 pl-2 select-none" @click="handleSelectPosition">
        {{ label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import useSelectedProperties from '../composables/useSelectedProperties.ts';

const selectedProps = useSelectedProperties();

const props = defineProps({
  propName: String,
});

const label = computed(() => {
  return props.propName.split('.').pop() || props.propName;
});

const isSelected = computed({
  get() {
    return selectedProps.value.includes(props.propName);
  },
  set(wasSelected) {
    if (wasSelected) {
      selectedProps.value = selectedProps.value.filter(p => p !== props.propName);
      return;
    }
    selectedProps.value.push(props.propName);
  },
});

const handleSelectPosition = () => {
  if (selectedProps.value.includes(props.propName)) {
    selectedProps.value = selectedProps.value.filter(p => p !== props.propName);
    return;
  }
  selectedProps.value.push(props.propName);
};
</script>
