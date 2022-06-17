import { defineStore } from 'pinia';
import overview from '@/schema/documents/overview';

const templates = {
  overview: () => overview.default(),
};

export const useDocumentStore = defineStore('documents', {
  state: () => ({
    types: {},
  }),
  actions: {
    initialize: (docs) => {
      const defaultState = docs.reduce((obj, doc) => ({
        ...obj,
        [doc.meta.template]: { ...templates[doc.meta.template](), generating: false },
      }), {});

      this.types = { ...this.types, defaultState };
    },
  },
});
