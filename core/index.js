import { createApp as _createApp } from 'vue';
import App from './app.vue';
import Dev from './dev.vue';
import Concrete from '@crhio/concrete';
import search from './directives/v-search';
import find from './directives/v-find';
import HostPlugin, { useHost } from './plugins/host';
import { createStore, initializeStore } from './store';
import './assets/styles/index.scss';
import { createRouter } from './router.js';

function installPlugins(app, { endpoints, locales, plugins, globalConfig }) {
  plugins?.forEach(plugin => loadPlugin(app, plugin));

  app.use(Concrete);
  app.use(HostPlugin, { endpoints, locales });
  app.use(find);
  app.use(search);

  if (globalConfig) {
    app.config.globalProperties.$config = globalConfig;
    app.provide('$config', globalConfig);
  }

  // app.config.globalProperties.$transact = function (cb) {
  //   this.$store.dispatch('transaction/transact', cb);
  // };
}

function loadPlugin(app, pluginConfig) {
  if (pluginConfig instanceof Array) {
    const [plugin, options] = pluginConfig;
    app.use(plugin, options);
  }

  return app.use(pluginConfig);
}

function getAppRootComponent(isDev) {
  return isDev ? Dev : App;
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
  const {
    globalComponents,
    mockConfig,
    locales,
    routes,
    storeConfig,
    models,
    migrations
  } = projectConfig;

  if (import.meta.env.DEV) {
    await import('./host-mock');
  }

  const Root = getAppRootComponent(env.DEV);
  const app = _createApp(Root);

  const store = createStore(storeConfig);
  const router = createRouter(projectConfig.routes);


  if (env.DEV) {
    const { useMock } = await import('./host-mock');
    useMock(env.VITE_PROXY_ACCESS_TOKEN, mockConfig, locales);
  }

  installPlugins(app, projectConfig);
  //
  globalComponents.forEach(component => app.component(component.name, component));

  const host = useHost();
  const initialState = host.getState();
  const initialUrl = host.getUrl();

  if (initialUrl) {
    router.replace(initialUrl).catch(() => {});
  }

  app.use(store)
     .use(router);

  // load initial url and initial state if host
  initializeStore(initialState, migrations);

  await router.isReady()

  app.mount('#app');

  if (env.DEV) {
    window.app = app;
  }
}
