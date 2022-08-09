<style scoped lang="scss">

  $height: 2.25rem;
  $width: $height;
  $expanded: 15rem;
  $radius: .25rem;

  .slide-enter {
    width: $width;
  }
  .slide-enter-to {
    width: $expanded;
  }
  .slide-enter-active {
    transition: width .25s;
  }

  @mixin button {
    z-index: 99;
    height: $height;
    width: $width;
    border-radius: $radius;
  }

  .search {
    position: relative;
    z-index: 99;
  }

  :deep(.concrete-input) {
    border-radius: $radius;
    padding: 0px 0.5rem;
    box-shadow: none !important;
    input {
      margin-right: $width / 2; // space for close button
    }
  }

  .search-button {
    @include button;
    margin-left: $expanded - $width;
    background: white;
    cursor: pointer;
    &:hover {
    }
  }

  .search-input {
    position: relative;
    @include button;
    width: $expanded;
  }

  .search-close {
    @include button;
    cursor: pointer;
    &:hover {
    }
    background: none;
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .search-results {
    position: absolute;
    right: 0px;
    top: 2.5rem;
    width: $expanded;
    border-radius: $radius;
    box-shadow: 1px 1px 0.375rem 0px rgba(0,0,0,0.01);

    .result {
      padding: 7px;
      cursor: pointer;
      &:first-child {
        border-radius: $radius $radius 0rem 0rem;
      }
      &:last-child {
        border-radius: 0rem 0rem $radius $radius;
      }
      &:hover {
      }
      &.selected {
      }
    }
  }
</style>


<template>
  <div class="search">

    <div class="h-box flex-limit justify-end">

      <!-- search button -->
      <div v-show="!showing" class="search-button c-box flex-limit" @click="open">
        <CIcon>
          <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="height: 1em; vertical-align: -0.125em;"><path fill="currentColor" d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z" class=""></path></svg>
        </CIcon>
      </div>

      <!-- search input -->
      <div v-show="showing" class="search-input h-box flex-limit items-center justify-end">

        <!-- close button -->
        <div class="search-close c-box flex-limit"  @click="close">
          <CIcon type="times" size="sm" />
        </div>

        <!-- input -->
        <transition name="slide">
          <CText-input
            ref="search"
            v-show="showing"
            :value='value'
            @change-value="$emit('input', $event);"
            @keydown.native.up="up"
            @keydown.native.down="down"
            @keydown.native.enter="select(selected)"
            @keydown.native.escape="close"
          />
        </transition>

      </div>

      <!-- search results -->
      <div v-show="showing" class="search-results">
        <div
          class="result"
          :class="{ selected: result.key == selected.key }"
          v-for="result in results.slice(0, 10)"
          :key="result.key"
          @click="select(result)"
          v-html="highlight(result.name)"
        />
      </div>
    </div>


  </div>
</template>


<script>
export default {
  name: 'Search',
  props: ['value', 'results'], // results = [{key, value}...]
  data() {
    return {
      showing: false,
      index: 0,
    };
  },
  computed: {
    selected() {
      if (this.results.length) {
        return this.results[this.index];
      }
      return null;
    },
  },
  watch: {
    results() {
      this.index %= this.results.length;
      this.index = this.index || 0;
    },
  },
  methods: {
    open() {
      const input = this.$refs.search.$el.getElementsByTagName('input')[0];
      this.showing = true;
      this.$nextTick(() => {
        input.focus();
        input.select();
      });
    },
    close() {
      this.showing = false;
    },
    up() {
      this.index = (this.results.length + this.index - 1) % this.results.length;
    },
    down() {
      this.index = (this.index + 1) % this.results.length;
    },
    select(result) {
      if (result) {
        this.$emit('select', result);
        this.close();
      }
    },
    highlight(value) {
      return value.replace(this.value, (match) => `<span class="highlight">${match}</span>`);
    },
  },
};
</script>
