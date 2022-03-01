import Vue from 'vue';
import Search from './search.vue';
import FormLabel from './inputs/form-label.vue';
import Parameter from './inputs/parameter.vue';
import InputGroup from './inputs/input-group.vue';


function globalize() {
  // input widgets
  Vue.component(Search.name, Search);

  // inputs
  Vue.component(FormLabel.name, FormLabel);
  Vue.component(InputGroup.name, InputGroup);
  Vue.component(Parameter.name, Parameter);
}

export default globalize;
