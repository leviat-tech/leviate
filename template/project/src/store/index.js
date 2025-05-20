import { transact } from '@crhio/leviate';
import { useCalculationStore } from './calculation';
import { useDocumentStore } from './documents';
import { useSettingsStore } from './settings.js';
import ExampleModel from '@/models/ExampleModel';

export default {
  state: {},
  actions: {
    initialize() {
      if (ExampleModel.read().length === 0) {
        transact('Create initial model', () => {
          ExampleModel.create();
        }, { skipRevision: true });
      }
    }
  },
  getters: {},
  // Include only modules which require data persistence
  modules: [
    useSettingsStore,
    useCalculationStore,
    useDocumentStore,
  ],
};
