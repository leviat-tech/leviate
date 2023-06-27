import { useCalculationStore } from './calculation';
import { useDocumentStore } from './documents';
import { useSettingsStore } from './settings.js';

export default {
  state: {},
  actions: {},
  getters: {},
  modules: [
    useSettingsStore,
    useCalculationStore,
    useDocumentStore,
  ],
};
