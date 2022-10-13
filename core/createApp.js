import { createApp as _createApp } from 'vue';
import Concrete from '@crhio/concrete';
import HostPlugin, { useHost } from './plugins/host';
import { createStore, initializeStore } from './store';
import { createRouter } from './router.js';
import concreteDefaultOptions from './concreteOptions';
import './assets/styles/index.css';

function installPlugins(
  app,
  { concreteOptions, endpoints, locales, plugins, globalConfig }
) {
  plugins?.forEach((plugin) => loadPlugin(app, plugin));

  const concreteConfig = { ...concreteDefaultOptions, ...concreteOptions };
  app.use(Concrete, concreteConfig);
  app.use(HostPlugin, { endpoints, locales });

  if (globalConfig) {
    app.config.globalProperties.$config = globalConfig;
    app.provide('$config', globalConfig);
  }
}

function loadPlugin(app, pluginConfig) {
  if (pluginConfig instanceof Array) {
    const [plugin, options] = pluginConfig;
    app.use(plugin, options);
  }

  return app.use(pluginConfig);
}

/**
 * @typedef {Object} ProjectConfig
 * @property {Array} routes
 * @property {Array} models an array of VuexORM models
 * @property {Object} locales
 * @property {Object} endpoints
 * @param {ProjectConfig} projectConfig
 * @param {VueComponent} Root - the app root component
 */
export async function createApp(projectConfig, Root) {
  const env = import.meta.env;
  const {
    globalComponents,
    routes,
    storeConfig,
    models,
    migrations,
    onAppCreated,
  } = projectConfig;


  const app = _createApp(Root);

  const router = createRouter(routes);
  const store = createStore(storeConfig, router);

  onAppCreated?.();

  installPlugins(app, projectConfig);
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
  initializeStore(initialState, migrations, models);

  await router.isReady()

  app.mount('#app');

  if (env.DEV) {
    window.app = app;
  }

  return app;
}
