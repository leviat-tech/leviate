<template>
    <div class="configuration relative flex flex-col flex-1 border-l border-r" ref="configuration">
      <LvToolbarContainer>
        <slot name="toolbar" />
      </LvToolbarContainer>

      <div class="configuration__content relative flex-1 overflow-y-auto">
        <div class="absolute inset-x-0 top-0">
          <slot></slot>
        </div>
      </div>

      <div class="absolute bottom-0 w-full">
        <div class="relative m-4 pb-4">
          <LvConfigurationErrors />
        </div>
      </div>
    </div>

</template>


<script setup>
import LvToolbarContainer from '../styled/LvToolbarContainer.vue';
import LvConfigurationErrors from './LvConfigurationErrors.vue';
</script>
