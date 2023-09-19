<template>
  <div class="" :class="widthClass">
    test
  </div>
</template>

<script setup>
import App from './App.vue';
import { useRootStore } from '../store';

const props = defineProps({
  expanded: String,
  collapsed: String,
  panelId: String,
});

const store = useRootStore();



const widthClass = computed(() => {
  if(store.panels[panelId].isExpanded) {
    return props.expanded;
  }
  return props.collapsed;
})

// need to update collapsed/expanded in a store for the panelId




</script>
