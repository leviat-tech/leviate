<template>
  <LvInputToolbar :tabs="tabList" />
  <LvInputContent>
    <ExampleTab v-if="activeTab === 0"/>
    <div v-if="activeTab === 1">test</div>
  </LvInputContent>
</template>

<script setup>
import { LvInputToolbar, LvInputContent } from '@crhio/leviate/components'
import ExampleTab from '@/components/input/tabs/ExampleTab.vue';

import { useLeviateStore } from '@crhio/leviate';
import { computed } from 'vue';

const store = useLeviateStore();
const activeTab = computed(() => store.panels.input.activeTab);

const tabList = ['Example', 'Test', 'Load Case', 'Reinforcement'];




</script>
