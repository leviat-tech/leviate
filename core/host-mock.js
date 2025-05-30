import inject from '@crhio/inject';
import logger from './extensions/logger.js';
import { ref } from 'vue';
import useVersions from './composables/useVersions';
import { cloneDeep, each, set, unset } from 'lodash-es';
import axios from 'axios';


const data = {
  meta: {},
  configuration: {},
  dictionary: {},
};

const activeVersionId = ref(null);

export function useMock() {
  const mockApi = {
    log(message, logData = '') {
      const { meta, configuration } = data;

      const lines = [
        `[Plugin: ${meta.configurator.name}] ${message}`,
        `  projectId  =  ${meta.project.id}`,
        `   designId  =  ${configuration.id}`,
        `       user  =  ${meta.user.email}`
      ]

      console.log(lines.join('\n'));
      if (logData) console.log('       data  = ', logData);
    },
    setUrl() {},
    getUrl: () => window.location.hash.replace(/^#/, ''),
    getState: () => data.configuration.state,
    getMeta: () => data.meta,
    getDictionary: () => data.dictionary,
    setState: (patch, versionId) => {
      const { activeVersion } = useVersions();
      const { state } = activeVersion.value;

      each(patch, (val, key) => {
        if (val === undefined) {
          unset(state, key);
        } else {
          set(state, key, val);
        }
      });

      data.configuration.state = state;

      if (!activeVersion.value) {
        logger.error('Active version not set');
        return;
      }

      activeVersion.value.state = state;

      syncVersionsData();
    },
    setName: async (name, versionId) => {
      const version = useVersions().getVersionById(versionId);

      if (!version) {
        logger.error(
          `Error setting name. Could not find version with id: ${versionId}`
        );
        return;
      }

      version.name = name;

      syncVersionsData();
    },
    setMeta(newMeta) {
      data.meta = Object.assign(data.meta, newMeta);
    },

    async fetchServiceToken() {
      const res = await axios.get('/auth/get-service-token').catch(console.log);
      return res.data;
    },

    // TODO: Deprecated but leaving in for legacy support
    async makeApiGatewayRequest({ method, url, data, options }) {
      const fetchUrl = ['/api/service', url].join('/').replace(/\/\//, '/');

      const res = await axios({ url: fetchUrl, method, data, ...options }).catch(e => {
        const { data } = e.response;
        const errorJSON = e.toJSON();
        return {
          isError: true,
          data,
          code: errorJSON.code,
          message: errorJSON.message,
          status: errorJSON.status,
        }
      });

      return (res.isError) ? res : res.data;
    },

    getConfiguration() {
      return data.configuration;
    },

    async getVersions() {
      // We could do this synchronously but make it async to correctly mirror the host method
      return getStoredData()?.versions || [];
    },

    async createVersion(name, fromId) {
      const state = cloneDeep(getVersionById(fromId).state);

      const { id } = mockApi.getConfiguration();
      // Generate a random-ish id
      const newId = Date.now().toString(32);
      const newVersion = {
        id: newId,
        parentId: id,
        name,
        createdAt: new Date().toISOString(),
        state,
      };

      modifyVersions((versions) => [...versions, newVersion]);

      logger.log(`Configuration '${name}' saved`);

      return newVersion;
    },

    getActiveVersionId() {
      return activeVersionId.value;
    },

    setActiveVersionId(id) {
      activeVersionId.value = id;
      saveDataToLocalStorage({ activeVersionId: id });
    },

    deleteVersion: async (id) => {
      modifyVersions((versions) =>
        versions.filter((version) => version.id !== id)
      );
    },
  };

  window.host = mockApi;

  function initialize(mockConfig, locales) {
    const { state, configuration, meta } = mockConfig;

    Object.assign(data, {
      meta,
      configuration: { ...configuration, state },
      dictionary: locales,
    });

    const storedData = getStoredData();

    if (storedData && storedData.versions?.length > 0) {
      const activeVersion = storedData.versions.find(
        (version) => version.id === storedData.activeVersionId
      );
      data.configuration.state = activeVersion?.state || state;
      activeVersionId.value = activeVersion
        ? storedData.activeVersionId
        : configuration.id;
    } else {
      const rootVersionId = configuration.id;
      const rootVersion = {
        ...data.configuration,
        createdAt: new Date().toISOString(),
      };

      saveDataToLocalStorage({
        versions: [rootVersion],
        activeVersionId: rootVersionId,
      });

      activeVersionId.value = rootVersionId;
    }

    if (!inject.hosted) {
      inject.mock(mockApi);
    }

    // Use timeout to prevent race conditions when deleting the active version
    // Otherwise deleting the active version will update the activeVersionId
    // and trigger the sync handler before the version has been deleted from storage
  }

  /****************************** LOCAL STORAGE MANAGEMENT ******************************/

  /**
   * Get the unique localStorage key for this application
   * @returns {string}
   */
  function getStorageKey() {
    const appNameSlug = data.meta.configurator.name
      .replace(/\s/g, '-')
      .toLowerCase();
    return ['leviat', appNameSlug].join(':');
  }

  /**
   * Get the data for this application from localStorage
   * @returns { { versions: [], activeVersionId: string } | null }
   */
  function getStoredData() {
    const key = getStorageKey();
    const storedJSON = localStorage.getItem(key);

    try {
      return JSON.parse(storedJSON);
    } catch (e) {
      logger.log(`Cannot get item: '${key}'`, e);
    }
  }

  function getVersionById(id) {
    const { versions } = getStoredData();

    return versions.find((version) => version.id === id);
  }

  /**
   * Retrieves versions from local storage and overwrites with the return value from the modifier callback
   * @param { function(versions: []) } modifier
   */
  function modifyVersions(modifier) {
    const { versions } = getStoredData();
    const newVersions = modifier(versions);

    saveDataToLocalStorage({ versions: newVersions });
  }

  /**
   * Store the current values from the useVersions composable in localStorage
   */
  function syncVersionsData() {
    const { versions, activeVersionId } = useVersions();
    const dataToStore = {
      activeVersionId: activeVersionId.value,
      versions: versions.value,
    };

    saveDataToLocalStorage(dataToStore);
  }

  /**
   * Merge the passed in data with the current data in localStorage
   * @param { object } [data]
   */
  function saveDataToLocalStorage(data) {
    const key = getStorageKey();
    const prevData = getStoredData() || {};
    const dataToStore = Object.assign({}, prevData, data);
    try {
      localStorage.setItem(key, JSON.stringify(dataToStore));
    } catch (error) {
      logger.error(
        `UNABLE TO PERSIST TO LOCAL STORAGE, REASON: ${error.message}`
      );
    }
  }

  /**
   * Clear this application's data from localStorage and refresh the page
   */
  function clearStorage() {
    const key = getStorageKey();

    localStorage.removeItem(key);

    window.location.reload();
  }

  return {
    initialize,
    clearStorage,
  };
}
