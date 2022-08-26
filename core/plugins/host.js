import inject from '@crhio/inject';
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

const HostPlugin = {
  install(app, { endpoints, locales }) {
    const $host = inject.attach({}).call;
    const $l = (phrase, options) => $host.localize(phrase, { ...options, fallback: locales })
    const $L = (phrase) => $host.localize(phrase, { capitalize: true, fallback: locales })

    // Store so module can be imported
    modules.host = $host;
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
  },
};

export const useHost = () => modules.host;
export const useLocalize = () => modules.localize;
export const useApi = () => modules.api;

export default HostPlugin;
