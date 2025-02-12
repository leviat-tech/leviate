<template>
  <LvLayout>

    <div class="max-h-full flex flex-grow divide-x w-full divide-base-300" v-if="entity">

      <LvInputPanel :tabs="tabs">
        <InputRoot />
      </LvInputPanel>

      <LvViewportPanel>
        <ViewportRoot />
      </LvViewportPanel>

      <LvResultsPanel :disabled="false">
        <ResultsRoot />
      </LvResultsPanel>

    </div>

  </LvLayout>
</template>

<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import useCurrentEntity from '@/composables/useCurrentEntity';

import InputRoot from '@/components/input/InputRoot.vue';
import ViewportRoot from '@/components/viewport/ViewportRoot.vue';
import ResultsRoot from '@/components/results/ResultsRoot.vue';

import { LvLayout, LvInputPanel, LvViewportPanel, LvResultsPanel } from '@crhio/leviate/components'

const entity = useCurrentEntity();
const router = useRouter()

watch(entity, (val) => {
  if (!val) router.replace('/not-found')
});

const tabs = ['example', 'test', 'load_case', 'reinforcement'];
</script>
