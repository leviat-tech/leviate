import inject from '@crhio/inject';
import { useLocalStorage } from './plugins/localStorage';
import axios from 'axios';


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
    async makeApiGatewayRequest({ method, url, data, options }) {
      const fetchUrl = ['/api/service', url].join('/').replace(/\/\//, '/');

      return axios({ url: fetchUrl, method, data, ...options }).catch(e => {
        const { data } = e.response;
        const errorJSON = e.toJSON();
        return {
          isError: true,
          data,
          code: errorJSON.code,
          message: errorJSON.message,
          status: errorJSON.status,
        }
      })
    }
  };

  if (!inject.hosted) {
    inject.mock(mockApi);
  }
}
