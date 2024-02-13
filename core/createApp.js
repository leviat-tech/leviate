import { createApp as _createApp } from 'vue';
import Concrete from '@crhio/concrete';
import HostPlugin, { useHost, hostIsConnected } from './plugins/host';
import { createStore, initializeStore } from './store';
import { createRouter } from './router.js';
import concreteDefaultOptions from './concreteOptions';
import './assets/styles/index.css';

function installPlugins(app, { concreteOptions, locales, plugins, globalConfig, store, router }) {
  plugins?.forEach((plugin) => loadPlugin(app, plugin));

  const concreteConfig = { ...concreteDefaultOptions, ...concreteOptions };
  app.use(Concrete, concreteConfig);
  app.use(HostPlugin, { locales, store, router });

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
 * @param {Boolean} isStandalone
 */
export async function createApp(projectConfig, Root, isStandalone) {
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

  installPlugins(app, { ...projectConfig, store, router });
  globalComponents.forEach(component => app.component(component.name, component));

  app
    .use(store)
    .use(router);

  await hostIsConnected();
  const host = useHost()
  const initialState = host.getState();
  const initialUrl = host.getUrl();

  if (initialUrl) {
    router.replace(initialUrl).catch(() => {});
  }


  // load initial url and initial state if host
  initializeStore(initialState, migrations, models);

  await router.isReady()

  app.mount('#app');

  if (isStandalone) {
    // Expose app and store globally for e2e testing
    window.store = store;
    window.app = app;
  }

  return app;
}