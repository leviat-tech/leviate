<template>
  <Disclosure v-slot="{ open }">
    <DisclosureButton
      @click="onClick(name)"
      @keydown.enter="onClick(name)"
      :data-cy="`project__${name}`"
      class="relative p-2 flex flex-col justify-center px-4 focus-visible:bg-sky focus-visible:text-white outline-none"
      :class="{
          'text-md text-white mx-1 mb-[2px] first-of-type:mt-1 last-of-type:mb-1 bg-indigo items-start' : isExpanded,
          'flex-1 text-center bg-gray-50 border-t border-t-gray-200 items-center first-of-type:border-none' : !isExpanded,
          'text-gray-500' : !isExpanded && !isActive,
          'border-r-4 border-indigo text-indigo' : !isExpanded && isActive,
        }">
      <LvTabText :is-expanded="isExpanded">{{ $L(`project_${name}`) }}</LvTabText>

    </DisclosureButton>

    <div v-show="isActive && isExpanded" class="overflow-y-auto bg-gray-50">
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
import { useRoute, useRouter } from 'vue-router';


const props = defineProps({
  name: String,
});

const router = useRouter();
const route = useRoute();
const leviate = useLeviateStore();

const isExpanded = computed(() => leviate.panels.project.isExpanded);
const isActive = computed(() => leviate.panels.project.activeItem === props.name);

function onClick(name) {
  if (isActive.value) {
    leviate.setActiveProjectItem(null);
    const { projectTab, ...query } = route.query;
    router.replace({ query });
  } else {
    leviate.setActiveProjectItem(name);
    router.replace({ query: { projectTab: name } });
  }
}
</script>
