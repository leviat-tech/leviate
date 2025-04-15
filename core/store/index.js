import { defineStore, createPinia } from 'pinia';
import { normie } from '@crhio/normie';
import { useMeta } from '@crhio/leviate';
import { isEmpty, get, last, range, each, omit, isEqual } from 'lodash-es';
import Migration from '../extensions/migration';
import revision from './plugins/revision';
import BaseModel from '../BaseModel';
import { useLocalize } from '../plugins/localize';
import logger from '../extensions/logger.js';
import useAppInfo from '../composables/useAppInfo.js';
import useVersions from '../composables/useVersions';
import { useHost } from '../plugins/host';

class TransactionError extends Error {
  constructor() {
    super();
    this.name = 'TransactionError';
  }
}

let storeConfig = {};

let useRootStore = () => logger.log('Root store has not been initialized');

let transactionUpdates = [];

function transact(cb) {
  if (useMeta().isReadOnly) {
    logger.log('Transaction skipped: Read-only mode.');
    return;
  }

  return useRootStore().transact(cb);
}

const initialState = {
  // used to determine whether realtime updates are external or a downstream reflection of local changes
  sessionId: null,
  // used to determine which migrations to perform
  serialization_version: null,
  transactionDepth: 0,
  appVersion: null,
};

function deepDiff(obj1, obj2) {
  const result = {
    oldValue: {},
    newValue: {},
  };

  function compare(item1, item2, path = '') {
    if (typeof item1 !== typeof item2) {
      result.oldValue[path] = item1;
      result.newValue[path] = item2;
      return;
    }

    if (typeof item1 !== 'object' || item1 === null || item2 === null) {
      if (item1 !== item2) {
        result.oldValue[path] = item1;
        result.newValue[path] = item2;
      }
      return;
    }

    // Check if both items are arrays
    if (Array.isArray(item1) && Array.isArray(item2)) {
      if (item1.length !== item2.length || !item1.every((item, index) => isEqual(item, item2[index]))) {
        result.oldValue[path] = item1;
        result.newValue[path] = item2;
      }
      return; // Don't iterate over array elements individually
    }

    const keys1 = Object.keys(item1);
    const keys2 = Object.keys(item2);

    for (const key of keys1) {
      compare(item1[key], item2[key], path ? `${path}.${key}` : key);
    }

    for (const key of keys2) {
      if (!keys1.includes(key)) {
        compare(undefined, item2[key], path ? `${path}.${key}` : key);
      }
    }
  }

  compare(obj1, obj2);

  return omit(result, ['newValue.transactionDepth','oldValue.transactionDepth']);
}

const initialActions = {
  async transact(cb) {
    if (this.transactionDepth === 0) {
      transactionUpdates = [];
    }

    this.transactionDepth++;

    try {
      const oldState = this.toJSON();

      let res = cb();

      this.transactionDepth --;

      if (res instanceof Promise) {
        await res.catch(this._onTransactionError);
      }

      const newState = this.toJSON();

      const diff = deepDiff(oldState, newState);

      const { activeVersion, activeVersionId } = useVersions();
      useHost().setState(diff.newValue, activeVersionId.value);
      transactionUpdates.unshift(diff);

      if (this.transactionDepth === 0) {
        this.revision.commit(transactionUpdates);
      }

      return res;
    } catch (e) {
      this._onTransactionError(e);
      return false;
    }
  },

  _onTransactionError(e) {
    if (!(e instanceof TransactionError)) {
      logger.error(e);
    }

    if (this.transactionDepth > 1) {
      // if we're in a nested transaction, propagate an error;
      throw new TransactionError();
    } else {
      // otherwise, undo to the last committed state;
      this.revision.undo();
      this.transactionDepth = 0;
    }
  },

  _registerModule(useStore) {
    const id = useStore.$id;
    let error;

    if (!id) error = 'invalid store definition';

    if (this[id]) error = `property ${id} already exists`;

    if (error) return logger.log(error);

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
        const module = useModule();
          module.$state = newState[key];
      } else {
        logger.error(`Store module ${key} does not exist`);
      }
    });

    this.$patch(rootState);
  },

  toJSON() {
    const { ...state } = this.$state;

    Object.keys(this.modules).forEach((id) => {
      state[id] = this.modules[id]().$state;
    });

    return JSON.parse(JSON.stringify(state));
  },
};

function getEntryFromId(state) {
  const { $L } = useLocalize();

  return function (id) {
    const [entityId, path] = id.split(':');
    const instance = this.getEntityById(entityId);

    const allSubpaths = range(path.length)
      .filter((i) => path[i] === '.')
      .map((i) => path.slice(0, i));

    const entitySubpaths = allSubpaths.filter(
      (subpath) => get(instance, subpath) instanceof BaseModel
    );
    const entityPath = entitySubpaths.map((subpath) => get(instance, subpath));
    const displayPath = entityPath.map((entity) => entity.name).join(' > ');

    const entity = last(entityPath) || instance;
    const termPath = entitySubpaths
      ? path.replace(last(entitySubpaths), '')
      : path;

    let term;
    if (get(instance, path) instanceof BaseModel) {
      term = get(instance, path).name;
    } else {
      term = entity.coercedSchema.getSearchTerm(termPath);
      term = $L(term, { capitalize: true });
    }
    return displayPath ? `${term} (${displayPath})` : term;
  };
}

function generateCurrentGetter(router) {
  return function (state) {
    const { entity, id } = router.currentRoute.value.params;

    if (!entity || !id) return null;

    return this.getEntity(entity, id);
  };
}

function getModel(state) {
  return (entityName) => {
    return state.modules?.entities?.().models[entityName];
  };
}

async function detectAppVersionMismatch(state) {
  const rootStore = useRootStore();
  const appInfo = useAppInfo();

  const manifest = await appInfo.fetchManifest();

  if (manifest.version && !rootStore.appVersion) {
    rootStore.appVersion = manifest.version;
  }

  return manifest.version !== rootStore.appVersion;
}

function getEntity(state) {
  return (entityName, entityId) => {
    return getModel(state)(entityName)?.find(entityId);
  };
}

function idToEntityName(state) {
  const map = {};

  each(state.modules.entities?.().$state, ({ dataById }, entityName) => {
    Object.keys(dataById).forEach((key) => {
      map[key] = entityName;
    });
  });

  return map;
}

function getEntityById(state) {
  return function (id) {
    const entityName = this.idToEntityName[id];
    return this.getEntity(entityName, id);
  };
}

function getStoreConfig(storeConfig, router) {
  const state = { ...initialState, ...storeConfig.state };
  const actions = { ...initialActions, ...storeConfig.actions };
  const modules = [...storeConfig.modules];
  const currentEntity = generateCurrentGetter(router);
  const getters = {
    idToEntityName,
    getEntityById,
    getEntryFromId,
    getModel,
    getEntity,
    currentEntity,
    detectAppVersionMismatch,
    ...storeConfig.getters,
  };

  return {
    state,
    actions,
    getters,
    modules,
  };
}

// function to initialize store given initial state
async function initializeStore(initialState, migrations, models) {
  // eslint-disable-line
  const rootStore = useRootStore();

  // Register user modules and normie entities module in the root store
  const useEntityStore = normie(defineStore, Object.values(models));
  const modules = storeConfig.modules.concat(useEntityStore);
  modules.forEach(rootStore._registerModule);

  performMigration(rootStore, initialState, migrations);

  // Initialize each module after migration has taken place
  Object.values(rootStore.modules).forEach((useStore) => {
    const store = useStore();
    if (useStore.$id !== 'entities' && typeof store.initialize === 'function')
      store.initialize();
  });

  rootStore.$patch({ transactionDepth: 0 });

  if (typeof rootStore.initialize === 'function') await rootStore.initialize();

  await detectAppVersionMismatch();
}

function performMigration(rootStore, initialState, migrations) {
  const migration = new Migration(migrations, initialState);
  const latestMigrationName = migration.latestMigrationName;
  if (!isEmpty(initialState)) {
    let migratedState;
    if (!migration.isUpToDate) {
      migratedState = migration.migrateToLatest();
      logger.log(`successfully migrated to latest: ${latestMigrationName}`);
    }
    rootStore.replaceState(migratedState || initialState);
  } else {
    rootStore.$patch({ serialization_version: latestMigrationName });
  }
}

function createStore(projectStoreConfig, router) {
  storeConfig = getStoreConfig(projectStoreConfig, router);

  const pinia = createPinia();
  pinia.use(revision);

  useRootStore = defineStore('root', {
    state: () => storeConfig.state,
    actions: storeConfig.actions,
    getters: storeConfig.getters,
  });

  return pinia;
}

export { transact, getStoreConfig, useRootStore, createStore, initializeStore };
