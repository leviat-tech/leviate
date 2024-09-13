import inject from '@crhio/inject';
import { useRootStore } from '../store';
import logger from '../extensions/logger';
import { useLocalize } from './localize';

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
};

let _resolve;
const hostPromise = new Promise(resolve => {
  _resolve = resolve;
})

export const hostIsConnected = () => hostPromise

export const useHost = () => modules.host
export const useMeta = () => modules.meta


const HostPlugin = {
  async install(app, { router }) {
    const setUrl = (url) => {
      if (router.currentRoute.value.path !== url) {
        router.push(url)
      }
    }
    const setState = (state) => {
      const store = useRootStore()
      store.replaceState(state)
    }

    // cache host getters so that they're not async
    const $host = (await inject.attach({ setUrl, setState })).call
    for (const key in $host) {
      if (key.startsWith('get')) {
        const syncKey = key.replace(/get(\w)/, (match, p1) => p1.toLowerCase());
        $host[syncKey] = await $host[key]();
      }
    }

    const meta = $host.meta;

    useLocalize().setLocale(meta.user.locale);

    // Store so module can be imported
    modules.host = $host;
    modules.meta = meta;

    app.config.globalProperties.host = $host;

    _resolve($host)
  },
};


export default HostPlugin;
