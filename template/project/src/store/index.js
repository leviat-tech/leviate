import Vue from 'vue';
import Vuex from 'vuex';
import pathify, { make } from 'vuex-pathify';
import VuexORM from '@vuex-orm/core';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import database from '@/models';
import Revision from '~/extensions/revision';
import Migration from '~/extensions/migration';
import migrations from '@/migrations';
import transaction from './transaction';
import display from './display';
import errors from './errors';
import search from './search';
import settings from './settings';
import documents from './documents';


Vue.use(Vuex);

// initial state
const state = {
  selected: { entity: null, field: null },
  messages: [],
  serialization_version: null,
};

const getters = {
  current(s, g) {
    let entity;
    if (s.route.name === 'panel') {
      entity = 'panels';
    }
    return entity && g[`entities/${entity}/query`]().withAllRecursive().whereId(s.route.params.id).first();
  },
};

const mutations = make.mutations(state);

// setup store
const store = new Vuex.Store({
  plugins: [pathify.plugin, VuexORM.install(database)],
  state,
  getters,
  mutations,
  modules: {
    display,
    errors,
    search,
    settings,
    documents,
  },
});

store.registerModule('transaction', transaction(store));

// setup undo/redo revision
store.revision = new Revision(store, 25, {
  autocommit(mutation, s) {
    return s.transaction.transactionDepth === 0
      && !mutation.type.startsWith('display')
      && !mutation.type !== 'transaction/cleanUpKilledTransaction';
  },
  committed(snapshot) {
    if (Vue.prototype.$host) {
      const filtered = omit(snapshot, ['selected', 'search']);
      filtered.settings = omit(filtered.settings, ['configName', 'locale']);
      Vue.prototype.$host.setState(filtered);
    }
  },
});

// function to initialize store given initial state
store.initialize = (initialState, { configurator, project, user }) => { // eslint-disable-line
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
};


export default store;
