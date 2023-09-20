<template>
  <div class="bg-white h-full flex flex-col justify-between overflow-hidden" :style="`width:${widthValue}px`">
    <slot/>
    <div class="w-full bg-gray-100 flex justify-end items-center pr-2 hover:text-steel-dark text-steel-darkest">
      <button @click="store.setPanelIsExpanded(props.panelId, !isExpanded)" class="flex justify-center items-center w-10 h-10">
        <icon-collapse v-if="store.panels[props.panelId].isExpanded" :class="{ 'rotate-180' : flip }"/>
        <icon-expand v-else :class="{ 'rotate-180' : flip }"/>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useLeviateStore } from '../../store/leviate';
import iconCollapse from '../icons/iconCollapse.vue';
import iconExpand from '../icons/iconExpand.vue';
import { computed } from 'vue';

const props = defineProps({
  expanded: {
    type: Number,
    default: 300,
  },
  collapsed: {
    type: Number,
    default: 60,
  },
  flip: {
    type: Boolean,
    default: false,
  },
  panelId: String,
});

const store = useLeviateStore();

const isExpanded = computed(() => store.panels[props.panelId].isExpanded);

const widthValue = computed(() => {
  return isExpanded.value ? props.expanded : props.collapsed;
});

const setCollapsed = () => {
  store.setPanelIsExpanded(props.panelId, false);
};

const setExpanded = () => {
  store.setPanelIsExpanded(props.panelId, true);
};
</script>
