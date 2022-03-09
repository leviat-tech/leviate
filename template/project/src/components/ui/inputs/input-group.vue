<style scoped lang="scss">
  .input-group {
    display: flex;
    height: 2rem;
    margin-bottom: 1rem;
    align-items: center;
  }

  .label {
    flex-basis: 30%;
  }

  .content {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .content > * {
    flex: 1;
  }

  .content > * + * {
    margin-left: 5px;
  }

  .outer {
    margin-left: 2.5px;
    margin-right: 5px;
  }

</style>

<template>
  <div class="input-group">
    <slot name="label">
      <label class="label" v-if="label">{{ label }}</label>
    </slot>

    <div ref="outer" :class="{ outer: hasOuterElement }">
      <slot name="outer" />
    </div>

    <div ref="content" class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputGroup',
  props: ['label'],
  data() {
    return {
      hasOuterElement: false,
    };
  },
  mounted() {
    this.hasOuterElement = this.$refs.outer.children.length > 0;

    this.observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.hasOuterElement = this.$refs.outer.children.length > 0;
        }
      });
    });

    this.observer.observe(this.$refs.outer, { childList: true });
  },
  destroyed() {
    this.observer.disconnect();
  },
};
</script>
