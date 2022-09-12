<template>
  <LvLayout>

    <div class="h-full flex" v-if="entity">

      <LvConfiguration class="flex-1">
        <template #toolbar>
          <TheConfigurationToolbar />
        </template>

        <TheConfigurationContent />
      </LvConfiguration>

      <TheViewport class="flex-1" />

    </div>

  </LvLayout>
</template>

<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import useCurrentEntity from '@/composables/useCurrentEntity';

import LvLayout from '@/components/scaffold/LvLayout.vue';
import TheViewport from '@/components/viewport/TheViewport.vue';
import LvConfiguration from '@/components/scaffold/LvConfiguration.vue';
import TheConfigurationToolbar from '@/components/configuration/TheConfigurationToolbar.vue';
import TheConfigurationContent from '@/components/configuration/TheConfigurationContent.vue';

const entity = useCurrentEntity();
const router = useRouter()

watch(entity, (val) => {
  if (!val) router.replace('/not-found')
});

</script>
