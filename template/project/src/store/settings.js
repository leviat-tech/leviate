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
      // Ensure app renders in saved language
      useHost().locale.value = this.locale;
    },
  }
});
