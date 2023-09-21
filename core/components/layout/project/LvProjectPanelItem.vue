<template>
  <Disclosure v-slot="{ open }">
    <DisclosureButton
        @click="leviate.setActiveProjectItem(name)"
        class="w-full font-semibold p-3 border-b flex flex-col justify-center items-center"
        :class="[
          isActive && isExpanded ? 'border-b-blue-500 border-b-2 text-blue-600' : 'bg-gray-100',
          !isExpanded && 'flex-1 text-center',
          ]">
      <div :class="!isExpanded && '-rotate-90 whitespace-nowrap'">{{ $L(`project_${name}`) }}</div>
    </DisclosureButton>

    <div v-show="isActive && isExpanded" class="flex-1 overflow-y-auto bg-white border-b">
      <!--
        Using the `static` prop, the `DisclosurePanel` is always
        rendered and the `open` state is ignored.
      -->
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

const props = defineProps({
  name: String,
});

const leviate = useLeviateStore();

const isExpanded = computed(() => leviate.panels.project.isExpanded);
const isActive = computed(() => leviate.panels.project.activeItem === props.name);
</script>
