<template>
  <div class="bg-white h-full flex flex-col justify-between overflow-hidden"
       :data-cy="`panel__${panelId}`"
       :class="isExpanded || 'flex-none'"
       :style="`width:${widthValue}px`">

    <!-- Panel content -->
    <div class="flex-1 overflow-hidden">
      <div class="h-full flex flex-col" :class="isExpanded" v-if="isExpanded">
        <slot/>
      </div>
      
      <button
        v-if="!isExpanded"
        class="flex h-full w-full items-center justify-center bg-base-50 hover:bg-base-100 outline-none"
        :class="disabled && 'cursor-default'"
        @click="(!disabled) ? store.setPanelIsExpanded(panelId, !isExpanded) : null"
      >
        <div :class="{'text-xs font-semibold [writing-mode:vertical-lr] whitespace-nowrap rotate-180' : !isExpanded }">
          {{ $L(panelId) }}
        </div>
      </button>
    </div>
    
    <!-- Panel toggle button -->
    <div v-if="!disabled" class="w-full bg-base-50 flex items-center border-t border-base-300 h-12"
         :class="(isExpanded && !flip) ? 'justify-end' : 'justify-start'">
      <button @click="store.setPanelIsExpanded(panelId, !isExpanded)" class="flex justify-center items-center w-[59px] h-10 text-base-600 hover:text-base-800 outline-none">
        <ChevronLeftIcon v-if="isExpanded" class="h-6 w-6" :class="{ 'rotate-180' : flip }" />
        <ChevronRightIcon v-else class="h-6 w-6" :class="{ 'rotate-180' : flip }"/>
      </button>
    </div>


  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid';
import { useLeviateStore } from '../../store/leviate';
import { computed, watch } from 'vue';

const props = defineProps({
  expanded: {
    type: Number,
    default: 300,
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
  return isExpanded.value ? props.expanded : 60;
});

watch(isExpanded, () => {
  // Ensure panel is closed before triggering any handlers that subscribe to the resize event
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  });
});
</script>
