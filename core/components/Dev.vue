<style scoped>
.host-bar {
  width: 256px;
}

.host-nav {
  color: #94979e;
  background: #f5f5f5;
  border-bottom: 1px solid #dfe0e3;
}
</style>

<template>
  <!-- provide a little host like context -->
  <div class="h-full flex flex-row">
    <div class="host-bar relative p-6 text-white text-center flex flex-col bg-gradient-to-b from-indigo to-indigo-darkest">
      <LvLogo width="160" class="" inverted/>

      <div class="text-left">
        <div class="text-xl opacity-50 my-4">DEVELOPMENT</div>
        {{ meta.configurator.name }}
      </div>

      <div class="dev__ui absolute bottom-4 left-0 px-6 w-full text-center text-xs">
          Leviate Framework v{{ frameworkVersion }}
      </div>
    </div>
    <div class="h-full w-full flex flex-col">
      <div class="bg-white text-indigo font-medium h-12 p-3 border-b space-x-4">
        <span>Projects</span>
        <span>></span>
        <span> {{ meta.project.name }}</span>
        <span>></span>
        <span>{{ configuration.name }}</span>
      </div>
      <div class="host-container relative h-full">
        <App />
      </div>
    </div>
  </div>
</template>

<script setup>
import App from './App.vue';
import { useHost } from '@crhio/leviate';
import LvLogo from '@crhio/leviate/components/ui/LvLogo.vue';

const frameworkVersion = import.meta.env.VITE_LEVIATE_VERSION;

const { meta, configuration } = useHost();
</script>
