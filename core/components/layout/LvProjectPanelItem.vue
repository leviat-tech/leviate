<template>
  <Disclosure v-slot="{ open }">
    <DisclosureButton
      @click="leviate.setActiveProjectItem(name)"
      class="w-full font-bold p-3 mb-px bg-gray-100"
      :class="isActive ? 'border-b-blue-500 border-b-2 text-blue-600' : 'bg-gray-100'"
    >
      {{ $L(`project_${name}`) }} {{ isActive + ' ' + isExpanded }}
    </DisclosureButton>

    <div v-show="isActive && isExpanded" class="flex-1 overflow-y-auto border-b">
      <!--
        Using the `static` prop, the `DisclosurePanel` is always
        rendered and the `open` state is ignored.
      -->
      <DisclosurePanel static>
        <slot />
      </DisclosurePanel>
    </div>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { useLeviateStore } from '../../store/leviate.js';
import { computed } from 'vue';

const props = defineProps({
  name: String,
});

const leviate = useLeviateStore();

const isExpanded = computed(() => leviate.panels.project.isExpanded);
const isActive = computed(() => leviate.panels.project.activeItem === props.name);
</script>
