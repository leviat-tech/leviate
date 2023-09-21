<template>
  <LvPanel :expanded="550" panelId="results" :flip="true" :class="{ 'opacity-50' : disabled }">
    <div class="flex h-full" @click="togglePanel">
      <div v-if="!store.panels['results'].isExpanded" class="flex h-full items-center justify-center cursor-pointer">
        <p class="-rotate-90">Results</p>
      </div>
      <slot v-else>
        <div>Result content</div>
      </slot>
    </div>
  </LvPanel>
</template>

<script setup>
import { useLeviateStore } from '../../store/leviate';
import LvPanel from '../ui/LvPanel.vue';
import { computed } from 'vue';

const store = useLeviateStore();
const togglePanel = () => {
  if(!props.disabled){
    store.panels['results'].isExpanded = !store.panels['results'].isExpanded 
  }
}

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  }
});


</script>
