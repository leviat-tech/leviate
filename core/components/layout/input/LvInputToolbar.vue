<template>
  <LvToolbar v-if="isExpanded">
    <slot />
    <div v-if="tabs.length > 0" class="flex divide-x divide-base-200 w-full h-12 justify-between">
      <LvHorizontalTab 
        v-for="tabId in tabs"
        :key="tabId"
        :data-cy="`input-tab__${tabId}`"
        :name="$L(tabId)"
        :active="activeTab === tabId"
        @clicked="clickTab(tabId)"
        @keyup.enter="$event.target.blur()" 
      />
    </div>
  </LvToolbar>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import { snakeCase } from 'lodash-es';

import LvToolbar from '../../ui/LvToolbar.vue';
import LvHorizontalTab from '../../ui/LvHorizontalTab.vue';
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
