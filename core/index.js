import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import Concrete from '@crhio/concrete';
import search from './directives/v-search';
import find from './directives/v-find';
import HostPlugin, { useHost } from './plugins/host';
import { createStore, initializeStore } from './store';
import { createRouter } from './router.js';
import './assets/styles/tailwinds.scss';

// Project imports
import routes from '@/routes';
import projectStoreConfig from '@/store';
import models from '@/models';
import globalComponents from '@/components';

Vue.config.productionTip = false;

function installPlugins(_Vue, { endpoints, plugins, globalConfig }) {
  plugins?.forEach(plugin => loadPlugin(_Vue, plugin));

  _Vue.use(HostPlugin, { endpoints });
  _Vue.use(find);
  _Vue.use(search);
  _Vue.use(Concrete, { size: 'sm' });

  if (globalConfig) {
    Vue.prototype.$config = globalConfig;
  }

  _Vue.prototype.$transact = function (cb) {
    this.$store.dispatch('transaction/transact', cb);
  };
}

function loadPlugin(_Vue, pluginConfig) {
  if (pluginConfig instanceof Array) {
    const [plugin, options] = pluginConfig;
    _Vue.use(plugin, options);
  }

  return _Vue.use(pluginConfig);
}

async function getAppRootComponent(isDev) {
  const appModule = (isDev) ? await import('./dev.vue') : await import('./app.vue');
  return appModule.default;
}


/**
 * @typedef {Object} ProjectConfig
 * @property {ProjectStoreConfig} storeConfig
 * @property {Array} routes
 * @property {Array} models an array of VuexORM models
 * @property {Object} locales
 * @property {Object} endpoints
 * @param {ProjectConfig} projectConfig
 * @param {{BASE_URL, DEV, VITE_PROXY_ACCESS_TOKEN}} env - the `import.meta.env` object compiled by vite
 // * @returns {Object} store config to be passed in to Vuex constructor
 */
export async function createApp(projectConfig, env) {

  if (env.DEV) {
    const { loadMock } = await import('./host-mock');
    loadMock(env.VITE_PROXY_ACCESS_TOKEN);
  }

  const storeConfig = {
    ...projectStoreConfig,
    models,
  };

  installPlugins(Vue, projectConfig);

  globalComponents.forEach(component => Vue.component(component.name, component));

  const store = createStore(Vue, storeConfig);
  const router = createRouter(Vue, routes, env.BASE_URL);

  sync(store, router);

  // load initial url and initial state if host provided it
  const host = useHost();
  const initialState = host.getState();
  const context = host.getMeta();
  initializeStore(store, initialState, context);

  const initialUrl = host.getUrl();
  if (initialUrl) {
    router.replace(initialUrl).catch(() => {
    });
  }

  const App = await getAppRootComponent(env.DEV);

  const vue = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');

  if (env.DEV) {
    window.vue = vue;
  }
}
