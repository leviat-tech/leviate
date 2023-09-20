<template>
  <div class="bg-white h-full flex flex-col justify-between overflow-hidden" :style="`width:${widthValue}px`">
    <slot />
    <div class="w-full h-10 bg-red-200 flex justify-end items-center px-2 hover:text-steel-dark text-steel-darkest cursor-pointer">
      <icon-collapse v-if="store.panels[props.panelId].isExpanded" @click="setCollapsed" :class="{ 'rotate-180' : flip }" />
      <icon-expand v-else  @click="setExpanded" :class="{ 'rotate-180' : flip }" />
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
  store.setPanelIsExpanded(props.panelId, false)
}

const setExpanded = () => {
  store.setPanelIsExpanded(props.panelId, true)
}
</script>
