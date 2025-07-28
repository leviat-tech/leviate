<template>
  <CNumericInput
    ref="el"
    :model-value="diameter"
    @update:modelValue="$emit('update:diameter', $event)"
    prefix="d"
    size="xs"
    no-units
    :unit="config.units"
  />
</template>

<script setup lang="ts">
import useDrawing from '../../composables/useDrawing';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  diameter: number;
}>();

const { state, config, popup } = useDrawing();
const el = ref(null);

watch(() => props.diameter, (newD, oldD) => {
  const diff = (newD - oldD) / 2;
  popup.y += diff / state.pxToSvg;
});

onMounted(() => {
  el.value.select();
});
</script>
