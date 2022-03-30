<style scoped lang="scss">

  $color: red;
  .error ::v-deep {
    position: relative;
    & input {
      border: 1px solid $color !important;
    }
    & .label {
      color: $color;
    }
    & .subtitle {
      font-size: 0.5rem;
      color: $color;
    }
  }
  .subtitle {
    position: absolute;
  }
</style>


<template>
  <div
    :class="{ error: errors && errors.length > 0 }"
    tabindex="-1"
    @focus="handleFocus"
  >
    <slot></slot>
    <div class="subtitle" v-for="error in errors" :key="error">
      {{ error }}
    </div>
  </div>
</template>


<script>
export default {
  name: 'Parameter',
  props: ['def', 'errors'],
  methods: {
    handleFocus() {
      this.$slots.default?.[0].elm.focus(); // eslint-disable-line
    },
  },
};
</script>
