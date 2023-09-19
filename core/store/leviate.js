import { defineStore } from 'pinia';

export const useLeviateStore = defineStore('leviate', {
  state: () => ({
    panels: {
      project: {
        isExpanded: true,
      },
      input: {
        isExpanded: true,
      },
      results: {
        isExpanded: false,
      },
    },
  }),
  actions: {
    setPanelIsExpanded(panelId, value) {
      this.panels[panelId].isExpanded = value;
    }
  },
  getters: {
  }
});