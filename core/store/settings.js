import { defineStore } from 'pinia';


export const useSettingsStore = defineStore('settings', {
  state: () => ({
    configName: '',
    locale: '',
    clientNotes: '',
    internalNotes: '',
  }),
  actions: {
    initialize: ({ name, locale }) => {
      this.name = name;
      this.locale = locale;
    },
  }
});
