<template>
  <DPopupWrapper @confirm="saveValue">
    <div class="space-y-2 w-20">
      <CNumericInput v-model="dimension" size="xs" :unit="config.units" no-units />
      <div class="flex justify-between">
        <button
          v-for="option in expandOptions"
          :key="option"
          :title="config.$l(`anchor_point_${directionToAnchorPoint[option]}`)"
          class="border border-transparent"
          :class="selectedExpandOption === option && '!border-gray-300 bg-white'"
          @mousedown="selectedExpandOption = option"
        >
          <component :is="icons[option]" class="p-0.5 w-fit h-fit" height="20" w="20"/>
        </button>
      </div>
    </div>
  </DPopupWrapper>
</template>

<script setup>
import { ref } from 'vue';
import useDrawing from '../../composables/useDrawing.ts';
import DPopupWrapper from './DPopupWrapper.vue';
import { calculateDistance, getSegmentsFromVertexList } from '../../utils';
import updateEdge from '../../operations/updateEdge';
import { DIM_ACHOR } from '../../constants.ts';

import ExpandBoth from '../../assets/dimension_expand_both.svg';
import ExpandLeft from '../../assets/dimension_expand_left.svg';
import ExpandRight from '../../assets/dimension_expand_right.svg';

const icons = {
  right: ExpandRight,
  left: ExpandLeft,
  both:ExpandBoth,
}

const emit = defineEmits(['update:vertices']);

const { config, popup } = useDrawing();

const props = defineProps({
  vertices: Object,
});

const segment = getSegmentsFromVertexList(props.vertices)[popup.data.index];
const dimension = ref(calculateDistance(segment.a, segment.b));
const edgeIndex = popup.data.index;

const expandOptions = ['right', 'both', 'left'];
const selectedExpandOption = ref(expandOptions[0]);
const directionToAnchorPoint = {
  right: DIM_ACHOR.start,
  both: DIM_ACHOR.centre,
  left: DIM_ACHOR.end,
};

function saveValue() {
  const newLength = dimension.value;

  if (Number.isNaN(newLength) || newLength <= 0) return;

  const anchorPoint = directionToAnchorPoint[selectedExpandOption.value];

  emit('update:vertices', {
    edgeIndex,
    newLength,
    vertices: updateEdge(props.vertices, edgeIndex, newLength, anchorPoint),
  });
}
</script>
