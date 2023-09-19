<template>
  <LvPanel :expanded="550" panelId="results" :flip="true">
    <slot>
      <div>results</div>
    </slot>
  </LvPanel>
</template>

<script setup>
import LvPanel from '../ui/LvPanel.vue';

</script>
