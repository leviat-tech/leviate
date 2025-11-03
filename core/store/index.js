import { nextTick } from 'vue';
import { defineStore, createPinia } from 'pinia';
import { normie } from '@crhio/normie';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty, get, last, range, each, omit, isEqual } from 'lodash-es';
import Migration from '../extensions/migration';
import revision from './plugins/revision';
import BaseModel from '../BaseModel';
import { useLocalize } from '../plugins/localize';
import logger from '../extensions/logger.js';
import useAppInfo from '../composables/useAppInfo.js';
import useVersions from '../composables/useVersions';
import { useHost, useMeta } from '../plugins/host';
import { useLeviateStore } from './leviate';
import { checkEntitiesIntegrity } from './storeUtils';
import useLoggerApi from '../composables/useLoggerApi';

class TransactionError extends Error {
  constructor() {
    super();
    this.name = 'TransactionError';
  }
}

let storeConfig = {};
let _useStateCompression = false;

let useRootStore = () => logger.log('Root store has not been initialized');

let transactionUpdates = null;

async function compressState(state) {
  const mod = await import('../composables/useStateCompression.ts');
  const { compress } = mod.default();
  return compress(state);
}

async function decompressState(state) {
  const mod = await import('../composables/useStateCompression.ts');
  const { decompress } = mod.default();
  return decompress(state);
}

async function hostSetState(newState) {
  const stateToSave = _useStateCompression
    ? await compressState(newState)
    : { ...newState, _compressed: undefined };

  const { activeVersionId } = useVersions();
  return useHost().setState(stateToSave, activeVersionId.value);
}

function transact(nameOrCallback, callback, options = { skipRevision: false }) {
  if (useMeta().isReadOnly) {
    logger.log('Transaction skipped: Read-only mode.');
    return;
  }

  let cb = callback;
  let name = nameOrCallback;

  if (typeof nameOrCallback !== 'string') {
    logger.warn(
      'legacy transact detected. Transaction will still run but in future you should use `transact(name, callback) for improved logging and debugging`'
    );
    cb = nameOrCallback;
    name = 'Anonymous transaction';
  }

  return useRootStore().transact(name, cb, options);
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
      if (
        item1.length !== item2.length ||
        !item1.every((item, index) => isEqual(item, item2[index]))
      ) {
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

  return omit(result, ['newValue.transactionDepth', 'oldValue.transactionDepth']);
}

const initialActions = {
  async transact(name, cb, options) {
    if (this.transactionDepth === 0) {
      transactionUpdates = { oldValue: {}, newValue: {} };
    }

    this.transactionDepth++;

    const transactionId = uuidv4();
    const oldState = this.toJSON();

    try {
      useLoggerApi().sendMessage('info', `Running transaction [ ${name} ]`, transactionId);

      let res = cb();

      // Ensure that any nested transactions within reactive handlers
      // are processed before continuing
      await nextTick();

      if (res instanceof Promise) {
        await res.catch((e) => {
          throw e;
        });
      }

      const newState = this.toJSON();

      const diff = deepDiff(oldState, newState);

      const stateToSave = _useStateCompression ? newState : diff.newValue;
      const updateKeys = { keys: Object.keys(stateToSave) };

      // Warn if there is nothing to update
      if (updateKeys.keys.length === 0) {
        logger.warn(`Nothing to save in transaction ${name}`);
      }

      if (!options.skipRevision) {
        Object.assign(transactionUpdates.oldValue, diff.oldValue);
        Object.assign(transactionUpdates.newValue, diff.newValue);
      }

      hostSetState(stateToSave);

      this.transactionDepth--;

      if (this.transactionDepth === 0 && !isEmpty(transactionUpdates.newValue)) {
        this.revision.commit(transactionUpdates, transactionId);
      }

      useLoggerApi().sendMessage('info', `Transaction [ ${name} ] completed successfully`, transactionId, updateKeys);

      return res;
    } catch (e) {
      this._onTransactionError(e, name, transactionId, oldState);
      return false;
    }
  },

  _onTransactionError(e, name, transactionId, oldState) {
    if (!(e instanceof TransactionError)) {
      logger.error('transaction failed -', e);
      useLoggerApi().sendMessage('error', `Transaction [ ${name} ] failed`, transactionId, e);
    }

    if (this.transactionDepth > 1) {
      // if we're in a nested transaction, propagate an error;
      throw new TransactionError();
    } else {
      if (transactionId === this.revision.transactionId) {
        this.revision.undo();
      } else {
        this.replaceState(oldState, true);
      }

      useLeviateStore().setGlobalMessage(useLocalize().$L('error_global'));

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

  replaceState(newState, shouldSync = false) {
    const serializedState = JSON.parse(JSON.stringify(newState));
    const rootState = {};

    Object.entries(serializedState).forEach(([key, value]) => {
      if (this.$state[key] !== undefined) {
        rootState[key] = value;
        return;
      }

      const useModule = this.modules[key];
      if (useModule) {
        const module = useModule();
        module.$state = serializedState[key];
      } else {
        logger.error(`Store module ${key} does not exist`);
      }
    });

    this.$patch(rootState);

    if (shouldSync) {
      hostSetState(serializedState);
    }
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
    const termPath = entitySubpaths ? path.replace(last(entitySubpaths), '') : path;

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
async function initializeStore(hostState, migrations, models) {
  await useVersions().isVersionsReady();

  // eslint-disable-line
  const rootStore = useRootStore();

  // Register user modules and normie entities module in the root store
  const useEntityStore = normie(defineStore, Object.values(models));
  const modules = storeConfig.modules.concat(useEntityStore);
  modules.forEach(rootStore._registerModule);

  const initialState = hostState._compressed
    ? await decompressState(hostState._compressed)
    : hostState;

  performMigration(rootStore, initialState, migrations);

  // Initialize each module after migration has taken place
  Object.values(rootStore.modules).forEach((useStore) => {
    const store = useStore();
    if (useStore.$id !== 'entities' && typeof store.initialize === 'function') store.initialize();
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
    rootStore.replaceState(migratedState || initialState, true);
  } else {
    hostSetState({ serialization_version: latestMigrationName });
  }

  const modifiedEntities = checkEntitiesIntegrity(rootStore);

  if (modifiedEntities) {
    hostSetState({ entities: modifiedEntities });
  }
}

function createStore(projectStoreConfig, router, useStateCompression) {
  _useStateCompression = useStateCompression;

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
