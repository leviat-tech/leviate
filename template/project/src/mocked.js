import axios from 'axios';
import locales from '@/locales';


let state = {};

const configurator = {
  schema: {},
  name: 'Konsola',
  dictionary: locales,
  documentTemplates: [
    {
      id: 1,
      name: 'Overview',
      format: 'pdf',
      meta: {
        template: 'overview',
      },
      dictionary: {
        en: {
          key: 'Value',
        },
      },
    },
  ],
};

const project = {
  name: 'My Project',
  account: {
    name: 'Fake Glazing Company',
  },
  address: {
    address: '1234 Address Blvd',
    city: 'New York',
    country: 'USA',
    name: 'Shop Address',
    postalCode: '12345',
  },
  assignments: [
    { id: 1, userId: 3 },
  ],
  users: [
    { id: 3, name: 'Chris Gaines' },
  ],
};

const user = {
  name: 'Wilt Chamberlain',
  locale: 'en',
  role: {
    name: 'admin',
  },
};

const company = {
  name: 'CRH Technology Studio',
};

const api = {
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
    return {
      configurator,
      project,
      user,
      company,
    };
  },
  setState(s) {
    state = s;
  },
  async setName(name) {
    console.log(name);
  },
  async authorizedPostRequest(url, data, config = {}) {
    const options = { ...config };
    options.headers = { ...options.headers, Authorization: `Bearer ${import.meta.env.VITE_PROXY_ACCESS_TOKEN}` };
    const encodedURL = encodeURIComponent(url);
    const response = await axios.post(`https://crh-host-proxy.herokuapp.com?url=${encodedURL}`, data, options);
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

export default api;
