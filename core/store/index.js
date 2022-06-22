import { defineStore, createPinia } from 'pinia';
import { cloneDeep, isEmpty } from 'lodash';
import Migration from '../extensions/migration';
import revision from './plugins/revision';

import { useDisplayStore } from './display';
import { useSearchStore } from './search';

class TransactionError extends Error {
  constructor() {
    super();
    this.name = 'TransactionError';
  }
}

let storeConfig = {};

const initialState = {
  selected: { entity: null, field: null },
  serialization_version: null,
  transactionDepth: 0,
};

const initialActions = {
  async transact(cb) {
    this.transactionDepth++;

    try {
      const res = cb();

      if (res instanceof Promise) {
        await res.catch(this.onTransactionError);
      }

      this.transactionDepth = 0;
    } catch(e) {
      this.onTransactionError(e)
    }
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

  registerModule(useStore) {
    const id = useStore.$id;
    let error;

    if (!id) error = 'invalid store definition';

    if (this[id]) error = `property ${id} already exists`;

    if (error) return console.log(error);

    if (!this.modules) this.modules = {};

    this.modules[useStore.$id] = useStore;
  },

  replaceState(newState) {
    const rootState = {};

    Object.entries(newState).forEach(([key, value]) => {
      if (this.$state[key]) rootState[key] = value;

      const useModule = this.modules[key];
      if (useModule) {
        useModule().$state = newState[key];
      } else {
        console.error(`Store module ${key} does not exist`)
      }
    });

    this.$patch(rootState);
  },

  toJSON() {
    const { ...state } = this.$state;

    Object.keys(this.modules).forEach(id => {
      state[id] = this.modules[id]().$state;
    });

    return JSON.parse(JSON.stringify(state));
  },
  initialize() {
    this.transactionDepth = 0;

  },
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

export const getStoreConfig = (storeConfig, models) => {
  const state = { ...initialState, ...storeConfig.state };
  const actions = { ...initialActions, ...storeConfig.actions };
  const modules = [useDisplayStore, useSearchStore, ...storeConfig.modules ];
  const getters = storeConfig.getters || {};

  return {
    state,
    actions,
    getters,
    modules
  };
};

  // const storeConfig = getStoreConfig(projectStoreConfig);

export let useRootStore = () => console.log('Root store has not been initialized');

// function to initialize store given initial state
export function initializeStore(initialState, migrations) { // eslint-disable-line
  const migration = new Migration(migrations, initialState);

  const rootStore = useRootStore();

  window.s = rootStore;

  storeConfig.modules.forEach(rootStore.registerModule);

  const latestMigrationName = migration.latestMigrationName;
  if (!isEmpty(initialState)) {
    let migratedState;
    if (!migration.isUpToDate) {
      migratedState = migration.migrateToLatest();
      console.log(`successfully migrated to latest: ${latestMigrationName}`);
    }
    rootStore.replaceState(migratedState || initialState);
  } else {
    rootStore.$patch({ serialization_version: latestMigrationName });
  }
  // Set default document state
  rootStore.$patch({ transactionDepth: 0 });
  // store.dispatch('calculation/initialize');
}

export function createStore(projectStoreConfig) {
  storeConfig = getStoreConfig(projectStoreConfig);

  useRootStore = defineStore('root', {
    state: () => storeConfig.state,
    actions: storeConfig.actions,
    getters: storeConfig.getters,
  });

  const pinia = createPinia();
  pinia.use(revision);
  return pinia;
}
