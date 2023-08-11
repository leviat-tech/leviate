import inject from '@crhio/inject';
import { get, merge } from 'lodash-es';
import { useStore } from '../store';

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
  meta: {},
  localize: uninitializedWarning('$l'),
};

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

const HostPlugin = {
  async install(Vue, { locales, router }) {
    // TODO: use vue2 router
    const setUrl = (url) => {
      if (router.currentRoute.path !== url) {
        router.push(url)
      }
    }

    const setState = (state) => {
      const store = useStore()
      store.replaceState(state)
    }

    // cache host getters so that they're not async
    const $host = (await inject.attach({ setUrl, setState })).call
    for (const key in $host) {
      if (key.startsWith('get')) {
        const value = await $host[key]()
        $host[key] = () => value;
      }
    }

    const dictionary = $host.getDictionary();
    merge(dictionary, locales)

    const meta = $host.getMeta();
    const locale = meta.user.locale;

    const $l = (phrase, options) => localize(dictionary, locale, phrase, options)
    const $L = (phrase, options) => localize(dictionary, locale, phrase, { ...options, capitalize: true })

    // Store so module can be imported
    modules.host = $host
    modules.meta = meta
    modules.localize = $l;

    Object.assign(Vue.prototype, { $host, $l, $L });

    _resolve($host)
  },
};


export default HostPlugin;
