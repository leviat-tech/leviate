<template>
    <div class="configuration flex flex-col flex-1 border-l border-r" ref="configuration">
      <LvToolbarContainer>
        <slot name="toolbar" />
      </LvToolbarContainer>

      <div class="configuration__content relative flex-1 overflow-y-auto">
        <div class="absolute + top-0">
          <slot></slot>
        </div>
      </div>

      <CStatusBar :messages="[]" />

    </div>

</template>


<script setup>
import { useErrorStore } from '@crhio/leviate/store/errors';
import LvToolbarContainer from '../styled/LvToolbarContainer.vue';
</script>
