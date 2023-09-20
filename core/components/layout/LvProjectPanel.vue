<template>
  <LvPanel :expanded="300" panelId="project" class="border-r">
    <div class="h-full flex flex-col justify-start">
      <LvProjectPanelItem name="versions">
        <LvVersions/>
      </LvProjectPanelItem>

      <slot />
    </div>
  </LvPanel>
</template>

<script setup>
import LvPanel from '../ui/LvPanel.vue';
import LvProjectPanelItem from './LvProjectPanelItem.vue';
import LvVersions from './project/LvVersions.vue';
import { provide } from 'vue';
</script>
