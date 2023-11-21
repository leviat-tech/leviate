<template>
  <div class="bg-white h-full flex flex-col justify-between overflow-hidden"
       :data-cy="`panel__${panelId}`"
       :class="isExpanded || 'flex-none'"
       :style="`width:${widthValue}px`">

    <!-- Panel content -->
    <div class="flex-1 overflow-hidden">
      <div class="h-full" :class="isExpanded">
        <slot/>
      </div>
    </div>

    <!-- Panel toggle button -->
    <div v-if="!disabled" class="w-full bg-gray-100 flex items-center border-t"
         :class="isExpanded ? 'justify-end' : 'justify-center'">
      <button @click="store.setPanelIsExpanded(panelId, !isExpanded)"
              class="flex justify-center items-center w-[59px] h-10 text-steel-darkest hover:text-black outline-none focus-visible:bg-sky focus-visible:text-white">
        <IconCollapse v-if="store.panels[panelId].isExpanded" :class="{ 'rotate-180' : flip }"/>
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
  disabled: {
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
</script>
