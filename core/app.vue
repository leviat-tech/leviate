<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
}
</style>

<template>
  <span>
    <router-view/>
    <lv-modal-app-info/>
  </span>
</template>

<script>
import LvModalAppInfo from './components/LvModalAppInfo.vue';

export default {
  name: 'App',
  components: { LvModalAppInfo },
};
</script>
