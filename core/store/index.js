import { defineStore } from 'pinia';
import { cloneDeep, isEmpty } from 'lodash';
import Migration from '../extensions/migration';
import revision from './plugins/revision';
import transaction from './transaction';
import display from './display';
import search from './search';

class TransactionError extends Error {}

const initialState = {
  selected: { entity: null, field: null },
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

export const getStoreConfig = (projectStoreConfig, models) => {
  const state = { ...initialState, ...projectStoreConfig.state };
  const mutations = projectStoreConfig.mutations || {};
  const plugins = projectStoreConfig.plugins || [];
  const modules = projectStoreConfig.modules || {};
  const database = getDatabase(models);
  const entities = projectStoreConfig.entities;
  const getters = projectStoreConfig.getters || {};


  return {
    plugins: [revision, ...plugins],
    state,
    getters,
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

  const storeConfig = getStoreConfig(projectStoreConfig);

export const useRootStore = defineStore('root', {
  state: () => ({
    transactionDepth: 0,
  }),
  actions: {
    async transact(cb) {
      this.transactionDepth++;

      await cb().catch(this.onTransactionError);
    },
    onTransactionError(e) {
      if (!(e instanceof TransactionError)) {
        console.error(e);
      }

      if (this.transactionDepth > 1) { // if we're in a nested transaction, propagate an error;
        throw new TransactionError();
      } else { // otherwise, undo to the last committed state;
        this.revision.undo();
        this.transactionDepth = 0;
      }
    },
    initialize() {
      this.transactionDepth = 0;
    },
  }
});

// function to initialize store given initial state
export function initializeStore(store, initialState, {configurator, project, user}, migrations) { // eslint-disable-line
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
