import inject from '@crhio/inject';

const uninitializedWarning = (pluginName) => () => {
  console.error(`${pluginName} has not been initialized. Did you call Vue.use(HostPlugin)?`);
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
  install(Vue, { endpoints, locales }) {
    const $host = inject.attach({}).call;
    const $l = (phrase, options = {}) => {
      return $host.localize(phrase, { ...options, fallback: locales });
    };

    // Store so module can be imported
    modules.host = $host;
    modules.localize = $l;

    // Assign to Vue prototype
    Object.assign(Vue.prototype, { $host, $l });

    // Create api endpoint methods
    Object.entries(endpoints).forEach(([key, url]) => {
      if (!url) return console.error(`Cannot create API: no url found for ${key}`);
      api[key] = createApi(url, $host);
    });
  },
};

export const useHost = () => modules.host;
export const useLocalize = () => modules.localize;

export default HostPlugin;
