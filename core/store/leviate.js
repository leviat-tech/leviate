import { defineStore } from 'pinia';

export const useLeviateStore = defineStore('leviate', {
  state: () => ({
    panels: {
      project: {
        isExpanded: true,
        activeItem: 'design',
      },
      input: {
        isExpanded: true,
        activeTab: null,
      },
      results: {
        isExpanded: false,
      },
      validation: {
        isExpanded: true
      }
    },
  }),
  actions: {
    setPanelIsExpanded(panelId, value) {
      this.panels[panelId].isExpanded = value;
    },
    setActiveProjectItem(name) {
      const { project } = this.panels;

      project.activeItem = name;

      if (!project.isExpanded) project.isExpanded = true;
    }
  },
  getters: {
    activeProjectItem: state => state.panels.project.activeItem,
    activeInputTab: state => state.panels.input.activeTab,
  }
});
