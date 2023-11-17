<template>
  <LvInputContent>
    <ExampleTab v-if="store.activeInputTab === 'example'"/>
    <div v-else class="text-xl font-bold p-4">
      {{ $L(snakeCase(store.activeInputTab)) }}
    </div>
  </LvInputContent>
</template>

<script setup>
import { snakeCase } from 'lodash-es';
import { LvInputContent } from '@crhio/leviate/components'
import ExampleTab from '@/components/input/tabs/ExampleTab.vue';

import { useLeviateStore } from '@crhio/leviate';

const store = useLeviateStore();
</script>
