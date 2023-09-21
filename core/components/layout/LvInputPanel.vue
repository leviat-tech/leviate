<template>
  <LvPanel :expanded="550" panelId="input">
    <div class="h-full flex flex-col justify-start">
      <InputRoot />
    </div>
  </LvPanel>
</template>

<script setup>

import LvPanel from '../ui/LvPanel.vue';
import LvInputPanelItemHorizontal from './input/LvInputPanelItemHorizontal.vue';
import LvInputPanelItemVertical from './input/LvInputPanelItemVertical.vue';
import InputRoot from '@/components/input/InputRoot.vue';

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

