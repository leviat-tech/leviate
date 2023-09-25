<template>
  <LvPanel :expanded="550" panelId="results" :flip="true" :class="{ 'opacity-50' : disabled }" :disabled="disabled">
      <button v-if="!isExpanded"
              class="flex h-full w-full items-center justify-center bg-gray-100 hover:bg-gray-200"
              :class="disabled && 'cursor-default'"
              @click="togglePanel"
      >
        <LvTabText :is-expanded="isExpanded">Results</LvTabText>
      </button>
      <slot v-else />
  </LvPanel>
</template>

<script setup>
import { useLeviateStore } from '../../store/leviate';
import LvPanel from '../ui/LvPanel.vue';
import { computed } from 'vue';
import LvTabText from '../ui/LvTabText.vue';

const store = useLeviateStore();

const isExpanded = computed({
  get: () => store.panels.results.isExpanded,
  set: (val) => store.panels.results.isExpanded = val
})

const togglePanel = () => {
  if(!props.disabled){
    isExpanded.value = !isExpanded.value
  }
}

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  }
});


</script>
