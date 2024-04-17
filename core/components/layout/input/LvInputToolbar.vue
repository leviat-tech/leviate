<template>
  <div class="flex w-full items-center border-b-2" :class="{'h-12' : isExpanded, 'flex-col h-full' : !isExpanded }">
    <slot />
    <div v-if="!isExpanded" class="h-12 w-full border-b bg-gray-50"></div>
    <div v-if="tabs.length > 0"
         class="flex w-full text-gray-400"
         :class="{ 'h-12' : isExpanded, 'flex-col flex-grow divide-y font-semibold -mb-1 bg-gray-50' : !isExpanded}">
      <button v-for="tabId in tabs" :key="tabId"
              :data-cy="`input-tab__${tabId}`"
              @click.stop="clickTab(tabId)"
              @keyup.enter="$event.target.blur()"
              class="text-center flex-grow h-full flex justify-center cursor-pointer px-1 py-1 items-center text-xs font-semibold bg-gray-50 outline-none focus-visible:bg-sky focus-visible:text-white"
              :class="{
          'border-b-[3px] border-b-indigo text-indigo' : isExpanded && activeTab === tabId,
          'border-b-[3px] border-b-transparent' : isExpanded && activeTab !== tabId,
          'border-r-4 border-r-indigo text-indigo' : !isExpanded && activeTab === tabId
        }"
      >
        <LvTabText :is-expanded="isExpanded">{{ $L(snakeCase(tabId)) }}</LvTabText>
      </button>
    </div>
  </div>

</template>

<script setup>
import { snakeCase } from 'lodash-es';

import { computed } from 'vue'
import { useLeviateStore } from '../../../store/leviate';
import LvTabText from '../../ui/LvTabText.vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  tabs: {
    type: Array,
    default: ['input'],
  },
  panel: {
    type: String,
    default: 'input'
  }
})

const store = useLeviateStore();
const activePanel = props.panel;

const isExpanded = computed(() => store.panels[activePanel].isExpanded);
const activeTab = computed(() => store.panels[activePanel].activeTab);

const clickTab = (tabId) => {
  store.panels[activePanel].activeTab = tabId;

  if (!store.panels.input.isExpanded) {
    store.panels[activePanel].isExpanded = true;
  }

  const query = { ...route.query };

  if (activePanel === 'input') {
    query.inputTab = tabId;
  } else {
    query.resultTab = tabId;
  }
  router.push({ query });
}

if (props.tabs.length > 0 && !props.tabs.includes(activeTab.value)) {
  clickTab(props.tabs[0]);
}

</script>

