<template>
  <DPopupWrapper @confirm="$emit('update:vertex', localVertex)">
    <div class="space-y-2 w-20">
      <span class="text-xs">{{ $L('round_node') }}</span>
      <CNumericInput
        v-model="localVertex.bulge"
        prefix="r"
        size="xs"
        :unit="config.units"
        no-units
      />
    </div>
  </DPopupWrapper>
</template>

<script setup>
import { computed } from 'vue';
import useDrawing from '../../composables/useDrawing.ts';
import DPopupWrapper from './DPopupWrapper.vue';

const { config } = useDrawing();

const props = defineProps({
  vertex: Object,
});

const emit = defineEmits(['update:vertex']);

const localVertex = computed({
  get: () => props.vertex,
  set: val => {
    emit('update:vertex', val);
  },
});
</script>
