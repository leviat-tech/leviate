<template>
  <DPopupWrapper @confirm="$emit('update:vertex', localVertex)">
    <div class="space-y-2 w-20">
      <CNumericInput v-model="localVertex.x" prefix="x" size="xs" :unit="config.units" no-units />
      <CNumericInput v-model="localVertex.y" prefix="y" size="xs" :unit="config.units" no-units />
    </div>
  </DPopupWrapper>
</template>

<script setup>
import { ref } from 'vue';
import useDrawing from '../../composables/useDrawing.ts';
import DPopupWrapper from './DPopupWrapper.vue';

const { config } = useDrawing();

const props = defineProps({
  vertex: Object,
});

console.log(props.vertex)

const localVertex = ref({ ...props.vertex });

defineEmits(['update:vertex']);
</script>
