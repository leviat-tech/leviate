/* eslint-disable */
import Vue from 'vue';
import { mapKeys, pickBy, mergeWith } from 'lodash-es';
import { make } from 'vuex-pathify';

const state = {
  globalErrors: {},
  calculationErrors: {},
};

const mutations = {
  ...make.mutations(state),
  setGlobalError(s, { type, text }) {
    Vue.set(s.globalErrors, type, text);
  },
  removeGlobalError(s, type) {
    if (s.globalErrors[type]) {
      Vue.delete(s.globalErrors, type);
    }
  },
  setCalculationErrors(s, { id, errors }) {
    Vue.set(s.calculationErrors, id, errors);
  },
  removeCalculationErrors(s, id) {
    if (s.calculationErrors[id]) {
      Vue.delete(s.calculationErrors, id);
    }
  }
};

const actions = {
  setTemporaryGlobalError({ commit }, { type, text, ms }) {
    commit('setGlobalError', { type, text });
    setTimeout(() => {
      commit('removeGlobalError', type);
    }, ms || 5000);
  }
}

const getters = {
  currentErrors(s, g, rootS, rootG) {
    const current = rootG.current;
    const formErrors = current.validate();
    const calculationErrors = s.calculationErrors[current.id] || {};
    // honestly we probably don't have to merge them because if there are form errors, there are no calculation errors;
    function customizer(objValue, srcValue) {
      if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    }
    return mergeWith({}, formErrors, calculationErrors, customizer);
  },
  getEntityErrors(s, g) {
    return (path) => mapKeys(
      pickBy(g.currentErrors, (v, k) => k.startsWith(path)),
      (v, k) => k.replace(`${path}.`, ''),
    );
  }
};

const errors = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
export default errors;
