import inject from '@crhio/inject';
import { useLocalStorage } from './plugins/localStorage';


export function useMock(mockConfig, locales) {
  let state = mockConfig.state || {};

  const storage = useLocalStorage(mockConfig.meta.configurator.name);
  const storedSettings = storage.getItem('settings');

  if (storedSettings) {
    state = storage.getItem(storedSettings.currentConfig)
  }

  const mockApi = {
    setUrl() {
    },
    getUrl() {
      const url = new URL(window.location.href);
      const path = url.hash.replace(/^#/, '');
      return path;
    },
    getState() {
      return state;
    },
    getMeta() {
      return mockConfig.meta;
    },
    getConfiguration() {
      return mockConfig.configuration;
    },
    getDictionary() {
      return locales;
    },
    setState(s) {
      state = s;
    },
    async setName(name) {
      console.log(name);
    },
  };

  if (!inject.hosted) {
    inject.mock(mockApi);
  }
}
