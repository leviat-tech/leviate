<template>
  <DPopupWrapper @confirm="saveValue">
    <div class="space-y-2 w-20">
      <CNumericInput v-model="inputValue" size="xs" no-units />
    </div>
  </DPopupWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Big from 'big.js'
import { convertToSI } from '@crhio/concrete/src/utils/units';
import useDrawing from '../../composables/useDrawing.ts';
import DPopupWrapper from './DPopupWrapper.vue';

const emit = defineEmits(['update:vertices']);

const { config, popup } = useDrawing();

const initialValue = Number(popup.target.innerHTML);
const inputValue = ref<number>(initialValue);

const props = defineProps({
  vertices: Object,
});

function saveValue() {
  const prevValue = Number(popup.data.value);
  const diffDisplay = Big(inputValue.value).minus(initialValue);
  const diffSI = convertToSI(diffDisplay, config.units);
  const newValue = Big(prevValue).plus(diffSI).toNumber();
  const axis = popup.data.axis;

  const newVertices = props.vertices.map(vertex => {
    if (vertex[axis] !== prevValue) {
      return vertex;
    }

    return { ...vertex, [axis]: newValue };
  });

  emit('update:vertices', {
    vertices: newVertices,
    axis,
    diffSI
  });
}
</script>
