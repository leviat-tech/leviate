<template>
  <LvPanel :expanded="300" panelId="project" class="bg-gray-100 border-r">
    <div class="h-full flex flex-col justify-start">
      <LvProjectToolbar />

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
import LvProjectToolbar from './project/LvProjectToolbar.vue';
</script>
