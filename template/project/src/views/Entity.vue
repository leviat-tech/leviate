<template>
  <LvLayout>

    <div class="h-full flex">

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
import LvLayout from '@/components/scaffold/LvLayout.vue';
import TheViewport from '@/components/viewport/TheViewport.vue';
import LvConfiguration from '@/components/scaffold/LvConfiguration.vue';
import TheConfigurationToolbar from '@/components/configuration/TheConfigurationToolbar.vue';
import TheConfigurationContent from '../components/configuration/TheConfigurationContent.vue';
</script>
