<template>
  <LvPanel :expanded="550" panelId="input">
    <div class="bg-indigo-light w-full h-full">
      <div class="flex flex-grow w-full h-full " :class="{ 'flex-col rotate-180' :!store.panels['input'].isExpanded }" >
        <div v-for="tab in tabs" class="text-center bg-steel-light w-full h-full flex justify-center cursor-pointer">
          <div class="" :class="{ '[writing-mode:vertical-lr]' :!store.panels['input'].isExpanded }">{{ tab }}</div>
        </div>
      </div>
      <div v-if="store.panels['input'].isExpanded">content</div>
    </div>
  </LvPanel>
</template>

<script setup>
import LvPanel from '../ui/LvPanel.vue';
import { useLeviateStore } from '../../store/leviate';

const tabs = ['Input'];

const store = useLeviateStore();

</script>

