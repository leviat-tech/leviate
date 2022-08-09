<template>
  <TheLayout>

    <div class="h-full flex">

      <LvConfiguration class="flex-1">
        <template #toolbar>
          <TheConfigurationToolbar />
        </template>

        <TheConfigurationContent />
      </LvConfiguration>

      <TheViewport class="flex-1" />

    </div>

  </TheLayout>
</template>

<script setup>
import TheLayout from '@/components/scaffold/TheLayout.vue';
import TheViewport from '@/components/viewport/TheViewport.vue';
import LvConfiguration from '@/components/scaffold/LvConfiguration.vue';
import TheConfigurationToolbar from '@/components/configuration/TheConfigurationToolbar.vue';
import TheConfigurationContent from '../components/configuration/TheConfigurationContent.vue';
</script>
