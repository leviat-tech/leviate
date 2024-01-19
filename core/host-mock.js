import axios from 'axios';
import inject from '@crhio/inject';
import { useLocalStorage } from './plugins/localStorage';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVICE_URL + '/api'
});

export function useMock(mockConfig, locales) {
  let state = mockConfig.state || {};

  const storage = useLocalStorage(mockConfig.meta.configurator.name);
  const storedSettings = storage.getItem('settings');

  if (storedSettings) {
    state = storage.getItem(storedSettings.currentConfig)
  }

  const mockApi = {
    makeApiGatewayRequest ({ method, url, data, options }) {
      const headers = {
        'x-service-key': import.meta.env.VITE_SERVICE_KEY
      };

      return instance[method](url, data, { ...options, headers });
    },
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
