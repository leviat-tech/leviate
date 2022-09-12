// Use this store to save document configuration and data

import { defineStore } from 'pinia';
// import overview from '@/schema/documents/overview';

export const useDocumentStore = defineStore('documents', {
  state: () => ({
    types: {},
  }),
  actions: {
    initialize: () => {
      console.log('Initializing documents store');
    },
  },
});
