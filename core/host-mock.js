import inject from '@crhio/inject';
import logger from './extensions/logger.js';

export function useMock(mockConfig, locales) {
  let state = mockConfig.state || {};

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
    getDictionary() {
      return locales;
    },
    setState(s) {
      state = s;
    },
    async setName(name) {
      logger.log(name);
    },
  };

  if (!inject.hosted) {
    inject.mock(mockApi);
  }
}
