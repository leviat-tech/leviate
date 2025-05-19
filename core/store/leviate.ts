import { defineStore } from 'pinia';

export type PanelNames = 'project' | 'input' | 'results' | 'validation'

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
        activeTab: null,
      },
      validation: {
        isExpanded: false
      }
    },
  }),
  actions: {
    setPanelIsExpanded(panelName: PanelNames, value: boolean) {
      this.panels[panelName].isExpanded = value;
    },
    setActiveProjectItem(name: string) {
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
