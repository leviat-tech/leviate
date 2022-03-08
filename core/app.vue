<style lang="scss">
  html,
  body {
    height: 100%;
    margin: 0;
  }
</style>
<style scoped lang="scss">
  // apply main scss to all children (it won't apply to layout's root unfortunately)
  ::v-deep {
    @import './assets/styles/main.scss';
  }
</style>

<template>
  <router-view></router-view>
</template>

<script>


export default {
  name: 'App',
};
</script>
