import { createApp as _createApp } from 'vue';
import { createPinia } from 'pinia';
import Concrete from '@crhio/concrete';
import search from './directives/v-search';
import find from './directives/v-find';
import HostPlugin, { useHost } from './plugins/host';
import { useRootStore, initializeStore } from './store';
import './assets/styles/index.scss';
import { createRouter } from './router.js';

Vue.config.productionTip = false;

function installPlugins(app, { endpoints, locales, plugins, globalConfig }) {
  plugins?.forEach(plugin => loadPlugin(_Vue, plugin));

  app.use(HostPlugin, { endpoints, locales });
  app.use(find);
  app.use(search);
  app.use(Concrete, { size: 'sm' });

  if (globalConfig) {
    app.config.globalProperties.$config = globalConfig;
  }

  // app.config.globalProperties.$transact = function (cb) {
  //   this.$store.dispatch('transaction/transact', cb);
  // };
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
export async function createApp(projectConfig, env) {
  if (import.meta.env.DEV) {
    await import('./host-mock');
  }

  const App = await getAppRootComponent(env.DEV);
  const app = _createApp(App);
  const pinia = createPinia();
  const router = createRouter();

  const storeConfig = {
    ...projectStoreConfig,
    models,
    migrations
  };


  if (env.DEV) {
    const { useMock } = await import('./host-mock');
    useMock(env.VITE_PROXY_ACCESS_TOKEN, mockConfig, locales);
  }

  installPlugins(app, projectConfig);

  globalComponents.forEach(component => Vue.component(component.name, component));

  // const store = createStore(Vue, storeConfig);

  // load initial url and initial state if host provided it
  const host = useHost();
  const initialState = host.getState();
  const context = host.getMeta();
  // initializeStore(store, initialState, context, migrations);

  const initialUrl = host.getUrl();
  if (initialUrl) {
    router.replace(initialUrl).catch(() => {});
  }

  app
    .use(pinia)
    .use(router);

  // pinia
  //   .use(revision);

  await router.isReady()

  app.mount('#app');

  if (env.DEV) {
    window.app = app;
  }


}
