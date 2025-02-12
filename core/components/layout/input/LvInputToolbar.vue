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

<script setup>
import { snakeCase } from 'lodash-es';

import { computed } from 'vue'
import { useLeviateStore } from '../../../store/leviate';
import LvToolbar from '../../ui/LvToolbar.vue';
import LvHorizontalTab from '../../ui/LvHorizontalTab.vue';
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

