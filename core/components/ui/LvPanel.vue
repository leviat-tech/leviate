<template>
  <div class="bg-white h-full flex flex-col justify-between overflow-hidden"
       :class="isExpanded || 'flex-none'"
       :style="`width:${widthValue}px`">

    <!-- Panel content -->
    <div class="flex-1 overflow-hidden">
      <div class="h-full">
        <slot/>
      </div>
    </div>

    <!-- Panel toggle button -->
    <div class="w-full bg-gray-100 flex items-center px-2 border-t"
         :class="isExpanded ? 'justify-end' : 'justify-center'">
      <button @click="store.setPanelIsExpanded(props.panelId, !isExpanded)"
              class="flex justify-center items-center w-10 h-10 hover:text-steel-dark text-steel-darkest"
              :disabled="isDisabled">
        <IconCollapse v-if="store.panels[props.panelId].isExpanded" :class="{ 'rotate-180' : flip }"/>
        <IconExpand v-else :class="{ 'rotate-180' : flip }"/>
      </button>
    </div>

  </div>
</template>

<script setup>
import { useLeviateStore } from '../../store/leviate';
import IconCollapse from '../icons/iconCollapse.vue';
import IconExpand from '../icons/iconExpand.vue';
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
  isDisabled: {
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
