import axios from 'axios';
import adapter from 'axios/lib/adapters/http';
import inject from '@crhio/inject';
import logger from './extensions/logger.js';

export function useMock(token, mockConfig, locales) {
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
    setState(s) {
      state = s;
    },
    async setName(name) {
      logger.log(name);
    },
    async authorizedRequest(method, url, data, config) {
      if (!token) {
        throw new Error('VITE_PROXY_ACCESS_TOKEN environment variable has not been set.');
      }

      const proxyUrl = import.meta.env.VITE_PROXY_URL;
      if (!proxyUrl) {
        throw new Error('VITE_PROXY_URL environment variable has not been set.');
      }

      // Use http adapt to prevent preflight reqs failing in test env
      const options = { ...config, adapter };
      options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
      const encodedURL = encodeURIComponent(url);

      // Create axios args
      const fullUrl = [`${proxyUrl}?url=${encodedURL}`];
      const args = [fullUrl];
      if (data) args.push(data);
      args.push(options);

      const action = axios[method];

      if (!action) {
        throw new Error(`Invalid request method: ${method}`);
      }

      const response = await action(...args);

      return response.data;
    },
    async authorizedGetRequest(url, config = {}) {
      return this.authorizedRequest('get', url, null, config);
    },
    async authorizedPostRequest(url, data, config = {}) {
      return this.authorizedRequest('post', url, data, config);
    },
    async authorizedPutRequest(url, data, config = {}) {
      return this.authorizedRequest('put', url, data, config);
    },
    async authorizedDeleteRequest(url, data, config = {}) {
      return this.authorizedRequest('delete', url, config);
    },
    localize(phrase, options = {}) {
      const capitalize = (string) => string.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
      const translation = locales.en[phrase] || options.default;
      if (translation === undefined) {
        logger.error(`Unable to translate ${phrase}`);
        return `{{ ${phrase} }}`
      }
      return options?.capitalize
        ? capitalize(translation)
        : translation;
    },
  };

  if (!inject.hosted) {
    inject.mock(mockApi);
  }
}
