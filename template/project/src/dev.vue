<style scoped lang="scss">
  .host-bar {
    padding: 30px;
    color: white;
    background: #3c3f48;
    width: 256px;
  }
  .host-nav {
    color: #94979e;
    background: #f5f5f5;
    border-bottom: 1px solid #dfe0e3;
    height: 48px;
    padding: 12px;
    z-index: 10;
  }
  .host-container {
    overflow-y: auto;
    padding-top: 48px;
    margin-top: -48px;
  }
</style>

<template>
  <!-- provide a little host like context -->
  <div class="h-full flex flex-row">
    <div class="host-bar text-center">
      TECH STUDIO
    </div>
    <div class="h-full w-full flex flex-col">
      <div class="host-nav">
        Projects > New Project > Item
      </div>
      <div class="host-container relative h-full">
        <application></application>
      </div>
    </div>
  </div>
</template>

<script>
import App from './app.vue';

export default {
  name: 'Dev',
  components: {
    application: App,
  },
};
</script>
