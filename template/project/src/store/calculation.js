// Use this store to perform calculation actions and
// set calculated values in the state

import { defineStore } from 'pinia';

export const useCalculationStore = defineStore('calculation', {
  state: () => ({

  }),
  actions: {
    initialize: () => {
      // Perform some checks here when loading a previously saved state
      console.log('Initializing calculation store');
    },
  },
});
