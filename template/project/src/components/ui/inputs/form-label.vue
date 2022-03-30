<style scoped lang="scss">
  .label {
    text-transform: capitalize;
  }
</style>


<template>
  <div class="label">
    <slot></slot>
  </div>
</template>


<script>
export default {
  name: 'FormLabel',
};
</script>
