<template>
  <LvPanel :expanded="550" panelId="input">
    <div class="h-full flex flex-col justify-start">
      <InputRoot />
    </div>
  </LvPanel>
</template>

<script setup>
import LvPanel from '../ui/LvPanel.vue';
import InputRoot from '@/components/input/InputRoot.vue';

</script>

