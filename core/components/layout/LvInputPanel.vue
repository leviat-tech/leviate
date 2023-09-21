<template>
  <LvPanel :expanded="550" panelId="input">
    <div class="h-full flex flex-col justify-start">

      <div class="flex h-12 border-b justify-between" >
        <div v-if="store.panels['input'].isExpanded" class="flex justify-between w-full divide-x">
          <LvInputPanelItemHorizontal v-for="tab in tabs">
            {{ tab }}
          </LvInputPanelItemHorizontal>
        </div>
        <div class="h-12" v-else></div>
      </div>
      <div v-if="store.panels['input'].isExpanded" class="w-full h-full">
        <slot />
      </div>
      <div v-if="!store.panels['input'].isExpanded" class="flex flex-grow w-full h-full flex-col divide-y divide-y-reverse">
        <LvInputPanelItemVertical v-for="tab in tabs">
          {{ tab }}
        </LvInputPanelItemVertical>
      </div>
    </div>
  </LvPanel>
</template>

<script setup>
import LvPanel from '../ui/LvPanel.vue';
import LvInputPanelItemHorizontal from './input/LvInputPanelItemHorizontal.vue';
import LvInputPanelItemVertical from './input/LvInputPanelItemVertical.vue';
import { useLeviateStore } from '../../store/leviate';
import { computed } from 'vue';

// const tabs = ['Input'];
const tabs = ['Geometry', 'Shoes & Bolts', 'Load Case', 'Reinforcement'];

const store = useLeviateStore();

const headerClass = computed(() => {
  return store.panels['input'].isExpanded 
    ? 'flex h-12 py-2 border-b justify-between'
    : 'flex flex-grow w-full h-full flex-col rotate-180'
})

</script>

