import { defineStore } from 'pinia';

export const useCalculationStore = defineStore('calculation', {
  state: () => ({

  }),
  actions: {
    initialize: () => {
      // Perform some checks here when loading a previously saved state
    },
  },
});
