<template>
  <div class="viewport flex flex-col">
    <LvToolbarContainer>
      <slot name="toolbar" />
    </LvToolbarContainer>

    <slot />
  </div>
</template>

<script setup>
import LvToolbarContainer from '../styled/LvToolbarContainer.vue';
</script>
