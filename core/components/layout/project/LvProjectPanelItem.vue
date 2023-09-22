<template>
  <Disclosure v-slot="{ open }">
    <DisclosureButton
      @click="leviate.setActiveProjectItem(name)"
      class="relative p-3 flex flex-col justify-center items-center"
      :class="isExpanded
        ? 'text-base bg-indigo hover:bg-indigo-light text-white mx-2 mb-2 first-of-type:mt-2'
        : 'flex-1 text-center border-b hover:bg-gray-200'
        ">
      <LvTabText :is-expanded="isExpanded">{{ $L(`project_${name}`) }}</LvTabText>

      <div v-if="isExpanded && isActive" class="absolute top-0 left-0 h-full w-3 bg-sky"/>
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
