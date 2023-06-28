import { defineStore } from 'pinia';
import { useLocalize } from '@crhio/leviate';


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
      useLocalize().setLocale(this.locale);
    },
  }
});
