<template>
  <LvLayout>

    <div class="h-full flex divide-x" v-if="entity">

      <LvInputPanel>
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
</script>
