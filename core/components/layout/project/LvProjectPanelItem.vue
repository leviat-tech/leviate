<template>
  <Disclosure v-slot="{ open }">
    <DisclosureButton
      @click="onClick(name)"
      @keydown.enter="onClick(name)"
      class="relative p-2 flex flex-col justify-center items-start pl-6 focus-visible:bg-sky focus-visible:text-white outline-none"
      :class="{
          'text-md text-white mx-1 mb-[2px] first-of-type:mt-1 last-of-type:mb-1 bg-indigo' : isExpanded,
          'flex-1 text-center bg-gray-50 border-t border-t-gray-200' : !isExpanded,
          'text-gray-500' : !isExpanded && !isActive,
          'border-r-4 border-indigo text-indigo' : !isExpanded && isActive,
        }">
      <LvTabText :is-expanded="isExpanded">{{ $L(`project_${name}`) }}</LvTabText>

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
import { useRouter } from 'vue-router';


const props = defineProps({
  name: String,
});

const router = useRouter();
const leviate = useLeviateStore();

const isExpanded = computed(() => leviate.panels.project.isExpanded);
const isActive = computed(() => leviate.panels.project.activeItem === props.name);

function onClick(name) {
  leviate.setActiveProjectItem(name);
  router.replace({ query: { projectTab: name } });
}
</script>
