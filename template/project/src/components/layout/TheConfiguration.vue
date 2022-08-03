<template>
    <div class="configuration flex flex-col flex-1 border-l border-r" ref="configuration">
      <!-- search tool-->
      <div class="border-b h-12">
        <div class="search-container">
<!--          <search-->
<!--            v-model="query"-->
<!--            :results="results"-->
<!--            @select="select"-->
<!--            ref="search"-->
<!--            v-shortkey.once="['ctrl', 'shift', 'f']"-->
<!--            @shortkey.native="$refs.search.open()"-->
<!--          />-->
        </div>
      </div>

      <!-- configuration -->
      <div class="configuration__content flex-1">
        <slot></slot>
      </div>

      <c-status-bar :messages="[]"></c-status-bar>

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
  data() {
    return {
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
