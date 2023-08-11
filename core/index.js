import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import Concrete from '@crhio/concrete';
import search from './directives/v-search';
import find from './directives/v-find';
import HostPlugin, { hostIsConnected, useHost, useLocalize, useMeta } from './plugins/host';
import { useApiGateway } from './composables/use-api-gateway';
import { createStore, initializeStore, useStore } from './store';
import './assets/styles/index.scss';
import { createRouter } from './router.js';

Vue.config.productionTip = false;

function installPlugins(_Vue, { endpoints, locales, plugins, globalConfig }) {
  plugins?.forEach(plugin => loadPlugin(_Vue, plugin));

  _Vue.use(HostPlugin, { endpoints, locales });
  _Vue.use(find);
  _Vue.use(search);
  _Vue.use(Concrete, { size: 'sm' });

  if (globalConfig) {
    _Vue.prototype.$config = globalConfig;
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
 * @property {Array} routes
 * @property {Array} models an array of VuexORM models
 * @property {Object} locales
 * @property {Object} endpoints
 * @param {ProjectConfig} projectConfig
 * @param {Object} env - the import.meta.env object
 */
async function createApp(projectConfig, env) {
  const {
    globalComponents,
    mockConfig,
    locales,
    routes,
    storeConfig,
    models,
    migrations
  } = projectConfig;


  if (env.DEV) {
    const { useMock } = await import('./host-mock');
    useMock(mockConfig, locales);
  }

  installPlugins(Vue, projectConfig);

  globalComponents.forEach(component => Vue.component(component.name, component));

  const store = createStore(Vue, storeConfig, models);
  const router = createRouter(Vue, routes);

  sync(store, router);

  await hostIsConnected();

  // load initial url and initial state if host provided it
  const host = useHost();
  const initialState = host.getState();
  const context = host.getMeta();
  initializeStore(store, initialState, context, migrations);

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

export {
  createApp,
  useHost,
  useLocalize,
  useMeta,
  useApiGateway,
  useStore,
}
