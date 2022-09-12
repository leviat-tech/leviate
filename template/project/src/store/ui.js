// Use this store for local UI state
// These properties won't be saved to the persistent state

import { defineStore } from 'pinia';


export const useUiStore = defineStore('ui', {
  state: () => ({
    currentTool: 'select',
  }),
});
