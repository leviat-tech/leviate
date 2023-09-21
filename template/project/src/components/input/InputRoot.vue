<template>
  <LvInputToolbar :tabs="tabList">
  </LvInputToolbar>
  <LvInputContent>
    <LvConfiguration class="flex-1" v-if="activeTab === 0 || activeTab === null">
      <TheConfigurationContent />
    </LvConfiguration>
    <div v-if="activeTab === 1">test</div>
  </LvInputContent>
</template>

<script setup>
import { LvInputToolbar, LvInputContent } from '@crhio/leviate/components'
import LvConfiguration from '@/components/scaffold/LvConfiguration.vue';
import TheConfigurationToolbar from '@/components/configuration/TheConfigurationToolbar.vue';
import TheConfigurationContent from '@/components/configuration/TheConfigurationContent.vue';
import ExampleForm from '@/components/forms/ExampleForm.vue';

import { useLeviateStore } from '@crhio/leviate';
import { computed } from 'vue';

const store = useLeviateStore();
const activeTab = computed(() => store.panels.input.activeTab);

const tabList = ['Geometry', 'Shoes & Bolts', 'Load Case', 'Reinforcement'];




</script>
