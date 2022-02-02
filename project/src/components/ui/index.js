import Vue from 'vue';
import KSearch from './k-search.vue';
import KLabel from './inputs/k-label.vue';
import KParameter from './inputs/k-parameter.vue';
import KInputGroup from './inputs/k-input-group.vue';


function globalize() {
  // input widgets
  Vue.component(KSearch.name, KSearch);

  // inputs
  Vue.component(KLabel.name, KLabel);
  Vue.component(KInputGroup.name, KInputGroup);
  Vue.component(KParameter.name, KParameter);
}

export default globalize;
