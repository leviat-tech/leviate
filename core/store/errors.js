import { defineStore } from 'pinia';

/* eslint-disable */
import mapKeys from 'lodash/mapKeys';
import pickBy from 'lodash/pickBy';
import mergeWith from 'lodash/mergeWith';
import omit from 'lodash/omit';

export const useErrorStore = defineStore('errors', {
  state: () => ({
    globalErrors: {},
    calculationErrors: {},
  }),
  actions: {
    setGlobalError({ type, text }) {
      this.globalErrors[type] = text;
    },
    removeGlobalError(type) {
      if (this.globalErrors[type]) {
        this.globalErrors = omit(this.globalErrors, type);
      }
    },
    setCalculationErrors({ id, errors }) {
      this.calculationErrors[id] = errors;
    },
    removeCalculationErrors(id) {
      if (this.calculationErrors[id]) {
        this.calculationErrors = omit(this.calculationErrors, id);
      }
    },
    setTemporaryGlobalError({ type, text, ms = 5000 }) {
      this.setGlobalError({ type, text });
      setTimeout(() => {
        this.removeGlobalError(type);
      });
    }
  }
});

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
