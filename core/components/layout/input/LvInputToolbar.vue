<template>
  <div
    class="flex w-full items-center border-b-2"
    :class="{ 'h-12': isExpanded, 'flex-col h-full': !isExpanded }"
  >
    <slot />
    <div v-if="!isExpanded" class="h-12 w-full border-b bg-gray-50"></div>
    <div
      v-if="tabs.length > 0"
      class="flex w-full text-gray-400"
      :class="{
        'h-12': isExpanded,
        'flex-col flex-grow divide-y font-semibold -mb-1 bg-gray-50': !isExpanded,
      }"
    >
      <button
        v-for="tab in tabs"
        :key="getTabName(tab)"
        :data-cy="`input-tab__${getTabName(tab)}`"
        @click.stop="clickTab(getTabName(tab))"
        @keyup.enter="$event.target.blur()"
        :disabled="typeof tab === 'object' && tab.disabled"
        class="text-center flex-grow h-full flex justify-center cursor-pointer px-1 py-1 items-center text-xs font-semibold bg-gray-50 outline-none focus-visible:bg-sky focus-visible:text-white"
        :class="{
          'border-b-[3px] border-b-indigo text-indigo': isExpanded && activeTab === getTabName(tab),
          'border-b-[3px] border-b-transparent': isExpanded && activeTab !== getTabName(tab),
          'border-r-4 border-r-indigo text-indigo': !isExpanded && activeTab === getTabName(tab),
          'disabled:cursor-not-allowed disabled:text-gray-300':
            typeof tab === 'object' && tab.disabled,
        }"
      >
        <LvTabText :is-expanded="isExpanded">{{ $L(snakeCase(getTabName(tab))) }}</LvTabText>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { snakeCase } from 'lodash-es';
import { useRoute, useRouter } from 'vue-router';

import LvTabText from '../../ui/LvTabText.vue';
import { PanelNames, useLeviateStore } from '../../../store/leviate';

const route = useRoute();
const router = useRouter();

type Tab = string | { name: string; disabled: boolean };

const props = withDefaults(
  defineProps<{
    tabs: Array<Tab>;
    panel?: PanelNames;
  }>(),
  {
    tabs: () => ['input'],
    panel: 'input',
  }
);

const store = useLeviateStore();
const activePanel: PanelNames = props.panel;

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
};

if (props.tabs.length > 0 && !props.tabs.includes(activeTab.value)) {
  clickTab(props.tabs[0]);
}

const getTabName = (tab: Tab): string => {
  if (typeof tab === 'object' && tab.name) {
    return tab.name;
  }

  return tab as string;
};
</script>
