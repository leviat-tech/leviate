<template>
  <LvPanel :expanded="550" panelId="input">
    <slot>
      <div>input</div>
    </slot>
  </LvPanel>
</template>

<script setup>
import LvPanel from '../ui/LvPanel.vue';

</script>
