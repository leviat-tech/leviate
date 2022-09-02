import { useCalculationStore } from './calculation';
import { useDocumentStore } from './documents';
import { useUiStore } from './ui';

export default {
  state: {},
  actions: {},
  getters: {},
  modules: [
    useCalculationStore,
    useDocumentStore,
    useUiStore,
  ],
};
