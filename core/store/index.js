import { defineStore, createPinia } from 'pinia';
import { normie } from '@crhio/normie';
import { isEmpty } from 'lodash-es';
import Migration from '../extensions/migration';
import revision from './plugins/revision';

import { useDisplayStore } from './display';

class TransactionError extends Error {
  constructor() {
    super();
    this.name = 'TransactionError';
  }
}

let storeConfig = {};

let useRootStore = () => console.log('Root store has not been initialized');

function transact (cb) {
  return useRootStore().transact(cb);
}

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

      return res;
    } catch(e) {
      this.onTransactionError(e)
      return false;
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
      if (this.$state[key] !== undefined) {
        rootState[key] = value;
        return;
      }

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
      const rootStore = useRootStore();
      const { entity, id } = rootStore.$route.params;
    },
  };
}

function getEntity(state) {
  return (entityName, entityId) => {
    return state.modules.entities?.().models[entityName]?.find(entityId);
  }
}

function getStoreConfig(storeConfig, models) {
  const state = { ...initialState, ...storeConfig.state };
  const actions = { ...initialActions, ...storeConfig.actions };
  const modules = [useDisplayStore, ...storeConfig.modules ];
  const getters = { getEntity, ...generateCurrentGetter(), ...storeConfig.getters };

  return {
    state,
    actions,
    getters,
    modules
  };
};

// function to initialize store given initial state
function initializeStore(initialState, migrations, models) { // eslint-disable-line
  const rootStore = useRootStore();

  // Register user modules and normie entities module in the root store
  const useEntityStore = normie(defineStore, Object.values(models));
  const modules = storeConfig.modules.concat(useEntityStore);
  modules.forEach(rootStore.registerModule);

  performMigration(rootStore, initialState, migrations)

  // Initialize each module after migration has taken place
  Object.values(rootStore.modules).forEach(useStore => {
    const store = useStore();
    if (
      useStore.$id !== 'entities' &&
      typeof store.initialize === 'function'
    ) store.initialize();
  })

  rootStore.$patch({ transactionDepth: 0 });
}

function performMigration(rootStore, initialState, migrations) {
  const migration = new Migration(migrations, initialState);
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
}

function createStore(projectStoreConfig, router) {
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

export {
  transact,
  getStoreConfig,
  useRootStore,
  createStore,
  initializeStore,

}