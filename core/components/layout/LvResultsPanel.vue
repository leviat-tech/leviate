<template>
  <LvPanel :expanded="width" panelId="results" :flip="true" :class="{ 'opacity-50' : disabled }" :disabled="disabled">
    <button v-if="!isExpanded"
            class="flex h-full w-full items-center justify-center bg-gray-100 hover:bg-gray-200 focus-visible:bg-sky focus-visible:text-white outline-none"
            :class="disabled && 'cursor-default'"
            @click="togglePanel"
    >
      <LvTabText :is-expanded="isExpanded">{{ $L('results') }}</LvTabText>
    </button>
    <div v-else-if="tabs" class="h-full flex flex-col justify-start -mx-px">
      <LvInputToolbar :tabs="tabs" panel="results" />
      <slot />
    </div>
    <slot v-else />
  </LvPanel>
</template>

<script setup>
import { useLeviateStore } from '../../store/leviate';
import LvPanel from '../ui/LvPanel.vue';
import { computed } from 'vue';
import LvTabText from '../ui/LvTabText.vue';
import LvInputToolbar from './input/LvInputToolbar.vue';

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
  width: {
    type: Number,
    default: 550,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  tabs: {
    type: Array,
  }
});
</script>
