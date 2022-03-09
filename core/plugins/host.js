import inject from '@crhio/inject';
import locales from '@/locales';

const uninitializedWarning = (pluginName) => () => {
  console.log(`${pluginName} has not been initialized. Did you call Vue.use(HostPlugin)?`);
};

const modules = {
  host: {},
  api: uninitializedWarning('api'),
  localize: uninitializedWarning('$l'),
};

function createApi(url, $host) {
  const sanitizedUrl = url.slice(-1) === '/' ? url : `${url}/`;

  return (...args) => {
    const specifyPath = (typeof args[0] === 'string');
    let fullPath = sanitizedUrl;
    let [data, options] = args;

    if (specifyPath) {
      fullPath = sanitizedUrl + args[0];
      data = args[1];
      options = args[2];
    }

    return $host.authorizedPostRequest(fullPath, data, options);
  };
}

const HostPlugin = {
  install(Vue, { endpoints }) {
    const $host = inject.attach({}).call;
    const $l = (phrase, options = {}) => {
      return $host.localize(phrase, { ...options, fallback: locales });
    };

    // Store so module can be imported
    modules.host = inject.attach({}).call;
    modules.host = inject.attach({}).call;

    // Assign to Vue prototype
    Object.assign(Vue.prototype, { $host, $l });

    // Create api endpoint methods
    modules.api = {};
    Object.entries(endpoints).forEach(([key, url]) => {
      if (!url) return console.error(`Cannot create API: no url found for ${key}`);
      modules.api[key] = createApi(url, $host);
    });
  },
};

export const useHost = () => modules.host;
export const useApi = () => modules.api;
export const useLocalize = () => modules.localize;

export default HostPlugin;
