<template>
  <LvPanel :expanded="300" panelId="project">
    <div class="h-full flex flex-col justify-start bg-gray-50">
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
import LvProjectPanelItem from './project/LvProjectPanelItem.vue';
import LvVersions from './project/LvVersions.vue';
import LvProjectToolbar from './project/LvProjectToolbar.vue';
</script>
