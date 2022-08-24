import { createApp as _createApp } from 'vue';
import App from './components/App.vue';
import Dev from './components/Dev.vue';
import Concrete from '@crhio/concrete';
import HostPlugin, { useHost } from './plugins/host';
import { createStore, initializeStore } from './store';
import { createRouter } from './router.js';
import concreteOptions from './concreteOptions';
import baseConfig from './base.config';
import './assets/styles/index.scss';

function installPlugins(app, { endpoints, locales, plugins, globalConfig }) {
  plugins?.forEach(plugin => loadPlugin(app, plugin));

  app.use(Concrete, concreteOptions);
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
export async function createApp(appConfig) {
  const env = import.meta.env;
  const projectConfig = { ...appConfig, ...baseConfig, mockConfig: env.DEV ? baseConfig.mockConfig : {}, };
  const {
    globalComponents,
    locales,
    mockConfig,
    routes,
    storeConfig,
    models,
    migrations
  } = projectConfig;


  const Root = getAppRootComponent(env.DEV);
  const app = _createApp(Root);

  const router = createRouter(routes);
  const store = createStore(storeConfig, router);

  // TODO: move this to a separate dev entry point
  if (env.DEV) {
    const { useMock } = await import('./host-mock');
    useMock(env.VITE_PROXY_ACCESS_TOKEN, mockConfig, locales);
  }

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
}
