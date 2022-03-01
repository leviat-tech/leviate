import Vuex from 'vuex';
import pathify, { make } from 'vuex-pathify';
import VuexORM from '@vuex-orm/core';
import { isEmpty, cloneDeep } from 'lodash';
import Migration from '../extensions/migration';
import migrations from '@/migrations';
import revision from './plugins/revision';
import transaction from './transaction';
import display from './display';
import errors from './errors';
import search from './search';
import settings from './settings';

const initialState = {
  selected: { entity: null, field: null },
  messages: [],
  serialization_version: null,
};

function generateCurrentGetter(entities) {
  return {
    current(state, getters) {
      const { name, params } = state.route;

      if (!entities.includes(name)) return null;

      const query = getters[`entities/${name}/query`];
      return query().withAllRecursive().whereId(params.id).first();
    },
  };
}

function getDatabase(models = []) {
  const database = new VuexORM.Database();

  models.forEach(database.register);

  return database;
}

/**
 * @typedef {Object} ProjectStoreConfig
 * @property {Array} plugins project plugins
 * @property {Object} modules project modules
 * @property {Array} models an array of VuexORM models
 * @param {ProjectStoreConfig} projectStoreConfig
 * @returns {Object} store config to be passed in to Vuex constructor
 */
export const getStoreConfig = (projectStoreConfig) => {
  const state = { ...initialState, ...projectStoreConfig.state };
  const plugins = projectStoreConfig.plugins || [];
  const modules = projectStoreConfig.modules || {};
  const database = getDatabase(projectStoreConfig.models);
  const entities = projectStoreConfig.entities;
  const coreGetters = projectStoreConfig.entities ? generateCurrentGetter(entities) : {};
  const projectGetters = projectStoreConfig.getters || {};


  return cloneDeep({
    plugins: [pathify.plugin, VuexORM.install(database), revision, ...plugins],
    state,
    getters: { ...coreGetters, projectGetters },
    mutations: make.mutations(state),
    modules: {
      display,
      errors,
      search,
      settings,
      transaction,
      ...modules,
    },
  });
};

export const createStore = (vueInstance, projectStoreConfig) => {
  vueInstance.use(Vuex);

  const storeConfig = getStoreConfig(projectStoreConfig);
  return new Vuex.Store(storeConfig);
};

// function to initialize store given initial state
export function initializeStore(store, initialState, {configurator, project, user}) { // eslint-disable-line
  const migration = new Migration(migrations, initialState);

  const latestMigrationName = migration.latestMigrationName;
  if (!isEmpty(initialState)) {
    let migratedState;
    if (!migration.isUpToDate) {
      migratedState = migration.migrateToLatest();
      console.log(`successfully migrated to latest: ${latestMigrationName}`);
    }
    store.revision.replace(migratedState || initialState);
  } else {
    store.commit('SET_SERIALIZATION_VERSION', latestMigrationName);
  }
  // Set default document state
  store.dispatch('transaction/initialize');
  store.dispatch('documents/initialize', configurator.documentTemplates);
  store.dispatch('settings/initialize', { name: project.name, locale: user.locale });
}
