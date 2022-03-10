<style scoped lang="scss">
@import "@/assets/styles/variables.scss";
</style>


<template>
  <c-form-section>
    <input-group :label="$l('Input')">
      <parameter
        v-find="'fixingsystem.designcode'"
        :errors="errors['fixingsystem.designcode']"
      >
        <c-input
          :value="1"
          @input="console.log($event)"
        />
      </parameter>
    </input-group>
  </c-form-section>
</template>


<script>
import { call, get } from 'vuex-pathify';
import debounce from 'lodash/debounce';
import SettingsIcon from 'leviate/assets/icons/cog.svg';
import InputGroup from '../ui/inputs/input-group.vue';

export default {
  components: { SettingsIcon, InputGroup },
  name: 'SampleForm',
  props: {
    instance: {
      type: Object,
      required: true,
    },
    // path: {
    //   type: String,
    //   required: true,
    // },
  },
  methods: {
    openForm: call('display/openForm'),
    async update(field, value) {
      await this.instance.$update(field, value);
    },
    getFindOptions(path) {
      const absolutePath = path ? `${this.path}.${path}` : this.path;
      return {
        id: absolutePath,
        before: () => this.openForm(this.instance.id),
      };
    },
  },
  computed: {
    getEntityErrors: get('errors/getEntityErrors'),
    errors() {
      return this.getEntityErrors(this.path);
    },
    debouncedUpdate() {
      return debounce(this.update, 500);
    },
  },
};
</script>
