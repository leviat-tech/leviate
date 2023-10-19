<template>
  <Disclosure v-slot="{ open }">
    <DisclosureButton
      @click="leviate.setActiveProjectItem(name)"
      class="relative p-3 flex flex-col justify-center items-start pl-6"
      :class="{
          'text-md text-white mx-1 mb-[2px] first-of-type:mt-2 bg-indigo' : isExpanded,
          'flex-1 text-center bg-gray-50 text-indigo border-t border-t-gray-200' : !isExpanded,
          'border-r-4 border-indigo' : !isExpanded && !isActive,
          'border-r-4 border-sky' : !isExpanded && isActive,
          'border-b-4 border-sky text-indigo' : isExpanded && isActive
        }">
      <LvTabText :is-expanded="isExpanded">{{ $L(`project_${name}`) }}</LvTabText>

      <!-- <div v-if="!isExpanded && isActive" class="absolute top-1 right-0 h-full border-t-2 w-1 bg-sky"/> -->

      <div v-if="isExpanded && isActive" class="triangle-down absolute top-11 left-5"/>
    </DisclosureButton>

    <div v-show="isActive && isExpanded" class="flex-1 overflow-y-auto bg-gray-50">
      <DisclosurePanel static>
        <slot/>
      </DisclosurePanel>
    </div>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { useLeviateStore } from '../../../store/leviate.js';
import { computed } from 'vue';
import LvTabText from '../../ui/LvTabText.vue';

const props = defineProps({
  name: String,
});

const leviate = useLeviateStore();

const isExpanded = computed(() => leviate.panels.project.isExpanded);
const isActive = computed(() => leviate.panels.project.activeItem === props.name);
</script>


<style scoped>
 .triangle-down {
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 18px solid #05C3DD;
  }
  
</style>