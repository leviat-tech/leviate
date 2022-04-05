import Vuex from 'vuex';
import pathify, { make } from 'vuex-pathify';
import VuexORM from '@vuex-orm/core';
import '@/schema/index';
import { isEmpty, cloneDeep } from 'lodash';
import Migration from '../extensions/migration';
import migrations from '@/migrations';
import revision from './plugins/revision';
import transaction from './transaction';
import display from './display';
import errors from './errors';
import search from './search';
import settings from './settings';

// Project config
import projectStoreConfig from '@/store';
import models from '@/models';

let store;

const initialState = {
  selected: { entity: null, field: null },
  serialization_version: null,
};

function generateCurrentGetter(entities) {
  return {
    current(state, getters) {
      const { name, params } = state.route;

      console.log(name, entities.includes(name));

      if (!entities.includes(name)) return null;

      const query = getters[`entities/${name}/query`];
      return query().withAllRecursive().whereId(params.id).first();
    },
  };
}

function getDatabase(models = []) {
  const database = new VuexORM.Database();

  models.forEach((model) => database.register(model));

  return database;
}

export const getStoreConfig = () => {
  const state = { ...initialState, ...projectStoreConfig.state };
  const mutations = projectStoreConfig.mutations || {};
  const plugins = projectStoreConfig.plugins || [];
  const modules = projectStoreConfig.modules || {};
  const database = getDatabase(models);
  const entities = projectStoreConfig.entities;
  const coreGetters = projectStoreConfig.entities ? generateCurrentGetter(entities) : {};
  const projectGetters = projectStoreConfig.getters || {};


  return {
    plugins: [pathify.plugin, VuexORM.install(database), revision, ...plugins],
    state,
    getters: { ...coreGetters, ...projectGetters },
    mutations: { ...mutations, ...make.mutations(state) },
    actions: projectStoreConfig.actions || {},
    modules: {
      display,
      errors,
      search,
      settings,
      transaction,
      ...modules,
    },
  };
};

export const createStore = (vueInstance) => {
  vueInstance.use(Vuex);

  const storeConfig = getStoreConfig();
  store = new Vuex.Store(storeConfig);
  return store;
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
  store.dispatch('calculation/initialize');
  store.dispatch('documents/initialize', configurator.documentTemplates);
  store.dispatch('settings/initialize', { name: project.name, locale: user.locale });
}

export function useStore() {
  return store;
}