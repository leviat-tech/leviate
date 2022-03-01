import axios from 'axios';
import adapter from 'axios/lib/adapters/http';
import inject from '@crhio/inject';
import leviateConfig from './leviate.config';
import mockConfig from '@/mock.config';
import locales from '@/locales';

let state = {};

const mockApi = {
  setUrl() {},
  getUrl() {
    const url = new URL(window.location.href);
    const path = url.hash.replace(/^#/, '');
    return path;
  },
  getState() {
    return state;
  },
  getMeta() {
    return mockConfig;
  },
  setState(s) {
    state = s;
  },
  async setName(name) {
    console.log(name);
  },
  async authorizedPostRequest(url, data, config = {}) {
    if (!import.meta.env.VITE_PROXY_ACCESS_TOKEN) {
      throw new Error('VITE_PROXY_ACCESS_TOKEN environment variable has not been set.');
    }

    // Use http adapt to prevent preflight reqs failing in test env
    const options = { ...config, adapter };
    options.headers = { ...options.headers, Authorization: `Bearer ${import.meta.env.VITE_PROXY_ACCESS_TOKEN}` };
    const encodedURL = encodeURIComponent(url);
    const response = await axios.post(`${leviateConfig.proxyUrl}?url=${encodedURL}`, data, options);
    return response.data;
  },
  localize(phrase, options = {}) {
    const capitalize = (string) => string.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
    const translation = locales.en[phrase] || options.default;
    if (translation === undefined) {
      console.error(`Unable to translate ${phrase}`);
    }
    return options?.capitalize
      ? capitalize(translation)
      : translation;
  },
};

if (!inject.hosted) {
  inject.mock(mockApi);
}
