<style scoped lang="scss">

$toolbar-height: 3rem;

  .configuration {
    position: relative;
    min-width: 25rem;
  }

  .config-content {
    height: 100%;
    width: 100%;
    padding-top: $toolbar-height;
  }

  .config-tools {
    min-height: $toolbar-height;
    position: absolute;
    padding-right: 1rem;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .search-container {
    height: $toolbar-height;
    display: flex;
    align-items: center;
    z-index: 98;
  }

  .scrolloff {
    height: 15vw;
  }

  .expand-enter, .expand-leave-to {
    transform: scaleX(0);
    transform-origin: left;
  }

  .expand-leave, .expand-enter-to {
    transform: scaleX(1);
    transform-origin: left;
  }

  .expand-enter-active, .expand-leave-active {
    transition: transform .25s;
  }

  .error {
    transition: transform 0.5s, opacity 0.5s;
    &.entity {
      cursor: pointer;
    }
  }

  .errors-enter, .errors-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  .errors-leave-active {
    position: absolute;
  }

  .errors-move {
    transition: transform 0.5s;
  }

  .generate {
    text-align: center;
    width: 100%;
    &.has-errors {
      padding-bottom: 0;
    }
  }

</style>


<template>
  <div>
    <div class="configuration v-box scroll" ref="configuration">
      <!-- search tool-->
      <div class="config-tools flex-limit border-b">
        <div class="search-container">
          <search
            v-model="query"
            :results="results"
            @select="select"
            ref="search"
            v-shortkey.once="['ctrl', 'shift', 'f']"
            @shortkey.native="$refs.search.open()"
          />
        </div>
      </div>

      <!-- configuration -->
      <div class="config-content">
        <slot></slot>
      </div>
    </div>

    <!-- status bar -->
    <transition name="expand">
      <c-status-bar class="status-bar m-6" v-if="hasErrors" type="danger">
        <transition-group name="errors" tag="ul">
          <li class="error" v-for="(error, key) in globalErrors" :key="key">
            {{ error }}
          </li>
          <li
            class="error entity"
            v-for="(errors, path) in currentErrors"
            :key="path"
            @click="clickEntityError(path)"
          >
            {{ getEntryFromPath(path) }}: {{ errors[0] }}
          </li>
        </transition-group>
      </c-status-bar>
    </transition>
  </div>

</template>


<script>
import { mapState } from 'pinia';
import isEmpty from 'lodash/isEmpty';
import { useErrorStore } from '@crhio/leviate/store/errors';
import { useSearchStore } from '@crhio/leviate/store/search';
import search from '@crhio/leviate/extensions/search';
import find from '@crhio/leviate/extensions/find';
import bus from '@crhio/leviate/extensions/eventBus';
import { useCalculationStore } from '@/store/calculation';


export default {
  name: 'configuration',
  data() {
    return {
      tags: {},
      query: '',
    };
  },
  created() {
    bus.on('foundElement', () => {
      if (this.$refs.configuration) {
        this.$refs.configuration.scrollTop -= 100;
      }
    });
  },
  computed: {
    ...mapState(useCalculationStore, ['generating']),
    ...mapState(useErrorStore, ['globalErrors', 'currentErrors']),
    ...mapState(useSearchStore, ['getEntryFromPath']),
    hasErrors() {
      return !isEmpty(this.globalErrors) || !isEmpty(this.currentErrors);
    },
    results() {
      if (!this.query) return []; // check query to tie computed to query
      return search.match(this.query);
    },
  },
  methods: {
    select({ el }) {
      this.query = '';
      const id = el.getAttribute('data-find-id');
      find.find(id);
    },
    clickEntityError(path) {
      find.find(path);
    },
  },
};
</script>
