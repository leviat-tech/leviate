import { defineStore } from 'pinia';


export const useDisplayStore = defineStore('display', {
  state: () => ({
    forms: {},
    currentTool: 'select',
  }),
  actions: {
    openForm(id) {
      this.forms[id] = true;
    },
    closeForm(id) {
      this.forms[id] = false;
    },
    setForm(id, payload) {
      this.forms[id] = payload;
    },
  }
});
