<template>
  <div class="flex w-full items-center" :class="{'border-b h-12' : isExpanded, 'flex-col h-full' : !isExpanded }">
    <slot />
    <div v-if="!isExpanded" class="h-12 border-b w-full"></div>
    <div v-if="tabs.length > 0" class="flex justify-between w-full border-b" :class="{ 'divide-x h-12' : isExpanded, 'flex-col flex-grow divide-y divide-y-reverse font-semibold' : !isExpanded  }">
      <div v-for="tab, index in tabs" :key="index"
        @click.stop="clickTab(index)"
        class="text-center w-full h-full flex justify-center cursor-pointer px-1 py-1 items-center text-xs hover:bg-indigo-lightest"
        :class="{'rotate-180 bg-gray-100' : !isExpanded, 'bg-white': isExpanded && isActive === index, 'bg-gray-100' : isExpanded && isActive !== index }"
      >
        <div :class="{'[writing-mode:vertical-lr]' : !isExpanded }">{{ tab }}</div>
      </div>
    </div>
  </div>
       
</template>

<script setup>
  import { computed } from 'vue'
  import { useLeviateStore } from '../../../store/leviate';

  const props = defineProps({
    tabs: {
      type: Array,
      default: ['Input'],
    }
  })

  const store = useLeviateStore();

  const isExpanded = computed(() => store.panels.input.isExpanded);
  const isActive = computed(() => store.panels.input.activeTab);

  const clickTab = (index) => {
    if(store.panels.input.isExpanded) {
      if(store.panels.input.activeTab !== index) {
        store.panels.input.activeTab = index;
      }
    } else {
      store.panels.input.activeTab = index;
      store.panels.input.isExpanded = true;
    }
  }

</script>

