import inject from '@crhio/inject';
import { get, merge } from 'lodash-es';
import logger from '../extensions/logger.js';

const uninitializedWarning = (pluginName) => () => {
  logger.error(`${pluginName} has not been initialized. Did you call app.use(HostPlugin)?`);
};

export const api = new Proxy({}, {
  get(target, prop) {
    if (!target[prop]) return uninitializedWarning(`api.${prop}`)();

    return target[prop];
  },
  set(target, prop, value) {
    if (typeof value !== 'function') {
      throw new TypeError(`Cannot create API key. ${prop} is not a function`);
    }

    target[prop] = value;

    return true;
  }
})

const modules = {
  host: {},
  meta: {},
  api: uninitializedWarning('api'),
  localize: uninitializedWarning('$l'),
};

function createApi(url, $host) {
  return (...args) => {
    const specifyPath = (typeof args[0] === 'string');
    let fullPath = url;
    let [data, options] = args;

    if (specifyPath) {
      // Ensure that the base and path are joined by a single slash in all conditions
      const basePath = url.replace(/\/$/, '');
      const specifiedPath = args[0].replace(/^\//, '');
      fullPath = [basePath, specifiedPath].join('/');

      data = args[1];
      options = args[2];
    }

    return $host.authorizedPostRequest(fullPath, data, options);
  };
}

function localize(dictionary, locale, phrase, options = {}) {
  const capitalize = string => string.replace(/(^|\s)\S/g, l => l.toUpperCase());
  const translation = get(dictionary, [locale, phrase])
    || options.default

  if (translation === undefined) {
    console.error(`Unable to translate ${phrase}`);
    return `{${phrase}}`;
  }
  return options.capitalize
    ? capitalize(translation)
    : translation;
}

let _resolve;
const hostPromise = new Promise(resolve => {
  _resolve = resolve;
})

export const hostIsConnected = () => hostPromise

export const useHost = () => modules.host
export const useMeta = () => modules.meta
export const useLocalize = () => modules.localize;
export const useApi = () => modules.api;

const HostPlugin = {
  async install(app, { endpoints, locales }) {
    const setUrl = () => console.log('fake set url')
    const setState = () => console.log('fake set state')
    const $host = (await inject.attach({ setUrl, setState })).call
    const dictionary = await $host.getDictionary();
    merge(dictionary, locales)

    const meta = await $host.getMeta();
    const locale = meta.user.locale;

    const $l = (phrase, options) => localize(dictionary, locale, phrase, options)
    const $L = (phrase, options) => localize(dictionary, locale, phrase, { ...options, capitalize: true })

    // Store so module can be imported
    modules.host = $host
    modules.meta = meta
    modules.api = api;
    modules.localize = { $l, $L };

    Object.assign(app.config.globalProperties, { $host, $l, $L });

    if (!endpoints) {
      logger.log('No endpoints defined in leviate.config.js');
      return;
    }

    // Create api endpoint methods
    Object.entries(endpoints).forEach(([key, url]) => {
      if (!url) return logger.error(`Cannot create API: no url found for ${key}`);
      api[key] = createApi(url, $host);
    });

    _resolve($host)
  },
};


export default HostPlugin;