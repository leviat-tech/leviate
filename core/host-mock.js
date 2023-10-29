import inject from '@crhio/inject';
import logger from './extensions/logger.js';
import { watch} from 'vue';
import useVersions, { activeVersionId } from './composables/useVersions';
import { cloneDeep } from 'lodash-es';


const data = {
  state: {},
  meta: {},
  configuration: {},
  dictionary: {}
};

export function useMock() {

  const mockApi = {
    setUrl() {},
    getUrl: () => window.location.hash.replace(/^#/, ''),
    getState: () => data.state,
    getMeta: () => data.meta,
    getDictionary: () => data.dictionary,
    setState: (state, versionId) => {
      // TODO: ensure the version id is passed in

      data.state = Array.isArray(state) ? state[0] : state;

      syncVersionsData();
    },
    setName: async (name, versionId) => {
      // Set the name of the specified version
    },
    setMeta(newMeta){
      data.meta = Object.assign(data.meta, newMeta);
    },

    getConfiguration() {
        return data.configuration;
    },

    async getVersions() {
      // We could do this synchronously but make it async to correctly mirror the host method
      return getStoredData()?.versions || [];
    },

    // TODO: fix inject to prevent passing args as an array
    async createVersion ([name, fromId]) {
      //TODO: throw an error if fromId isn't associated with this configuration
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

      modifyVersions(versions => [...versions, newVersion]);

      logger.log(`Configuration '${name}' saved`);

      return newVersion;
    },

    deleteVersion: (_id) => {
      // TODO: fix inject to prevent passing args as an array
      const [id] = _id;

      modifyVersions(versions => versions.filter(version => version.id !== id));
    },
  };

  window.host = mockApi;

  function initialize(mockConfig, locales) {
    data.state = mockConfig.state;
    data.configuration = { ...mockConfig.configuration, state: mockConfig.state };
    data.meta = mockConfig.meta;
    data.dictionary = locales;

    const storedData = getStoredData();

    if (storedData) {
      data.state = storedData.versions.find(version => version.id === storedData.activeVersionId).state;
      activeVersionId.value = storedData.activeVersionId;
    } else {
      saveDataToLocalStorage({
        versions: [
          { ...mockConfig.configuration, state: mockConfig.state },
        ],
        activeVersionId: mockConfig.configuration.id
      });

      activeVersionId.value = mockConfig.configuration.id;
    }

    if (!inject.hosted) {
      inject.mock(mockApi);
    }

    watch(activeVersionId, syncVersionsData);
  }

  /****************************** LOCAL STORAGE MANAGEMENT ******************************/

  /**
   * Get the unique localStorage key for this application
   * @returns {string}
   */
  function getStorageKey() {
    const appNameSlug = data.meta.configurator.name.replace(/\s/g, '-').toLowerCase();
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
    } catch(e) {
      logger.log(`Cannot get item: '${key}'`, e);
    }
  }

  function getVersionById(id) {
    const { versions } = getStoredData();

    return versions.find(version => version.id === id);
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
      versions: versions.value
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
    localStorage.setItem(key, JSON.stringify(dataToStore));
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
  }
}
