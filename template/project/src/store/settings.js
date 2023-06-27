import { defineStore } from 'pinia';
import { useHost } from '@crhio/leviate';


export const useSettingsStore = defineStore('settings', {
  state: () => ({
    configName: '',
    locale: '',
    clientNotes: '',
    internalNotes: '',
  }),
  actions: {
    initialize() {
      useHost().locale.value = this.locale;
    },
  }
});
