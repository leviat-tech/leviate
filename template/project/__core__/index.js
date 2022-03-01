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


async function installPlugins(_Vue, { endpoints }) {
  _Vue.config.productionTip = false;

  _Vue.use(HostPlugin, { endpoints });
  _Vue.use(find);
  _Vue.use(search);
  _Vue.use(Concrete, { size: 'sm' });

  _Vue.prototype.$transact = function (cb) {
    this.$store.dispatch('transaction/transact', cb);
  };
}

function getAppRootComponent() {
  return (import.meta.env.DEV) ? import('./dev.vue') : import('./app.vue');
}


/**
 * @typedef {Object} ProjectConfig
 * @property {ProjectStoreConfig} storeConfig
 * @property {Array} routes
 * @property {Array} models an array of VuexORM models
 * @property {Object} locales
 * @property {Object} endpoints
 * @param {ProjectConfig} projectConfig
 // * @returns {Object} store config to be passed in to Vuex constructor
 */
export async function createApp(projectConfig) {
  if (import.meta.env.DEV) {
    await import('./host-mock');
  }

  const { endpoints } = projectConfig;
  const storeConfig = {
    ...projectStoreConfig,
    models,
  };

  await installPlugins(Vue, { endpoints });

  const router = createRouter(Vue, routes);
  const store = createStore(Vue, storeConfig);
  const App = await getAppRootComponent();

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

  const vue = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
}
