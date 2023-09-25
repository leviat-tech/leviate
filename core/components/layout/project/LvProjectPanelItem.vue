<template>
  <Disclosure v-slot="{ open }">
    <DisclosureButton
      @click="leviate.setActiveProjectItem(name)"
      class="relative p-3 flex flex-col justify-center items-center bg-indigo text-white"
      :class="{
          'text-sm hover:bg-sky text-white mx-1 mb-[2px] first-of-type:mt-2' : isExpanded,
          'flex-1 text-center border-t hover:bg-indigo-light' : !isExpanded,
          'bg-sky' : isActive
        }">
      <LvTabText :is-expanded="isExpanded">{{ $L(`project_${name}`) }}</LvTabText>

      <!-- <div v-if="isExpanded && isActive" class="absolute top-0 left-0 h-full w-3 bg-sky"/> -->
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
