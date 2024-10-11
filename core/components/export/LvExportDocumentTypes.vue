<template>
  <div class="text-sm mb-2 font-semibold">{{ $l(label) }}</div>

  <CRadioGroup
    v-model="model"
    no-label
    reverse-labels
    :options="props.options"
    :formatter="(val: string) => $l(val)"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const emit = defineEmits(['changeType']);

  const props = defineProps({
    label: {
      type: String,
      default: 'document',
    },
    selectedOption: {
      type: String,
      default: null,
    },
    options: {
      type: Array<string>,
      required: true,
      validate: (value: Array<string>) => {
        const availabeTypes = ['report_pdf', 'drawings_dxfs', 'parts_list'];

        return value.every((val: string) => availabeTypes.includes(val));
      },
    },
  });

  const model = computed({
    get() {
      if (!props.selectedOption) {
        return props.options[0];
      }

      return props.selectedOption;
    },
    set(val) {
      emit('changeType', val);
    },
  });
</script>
