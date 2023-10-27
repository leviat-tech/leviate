import inject from '@crhio/inject';
import logger from './extensions/logger.js';
import { reactive, watchEffect } from 'vue';
import useVersions from './composables/useVersions';


const localSettings = {
  versionIds: [],
  activeVersionId: null,
};

const data = {
  state: {},
  configuration: {},
  versions: [],
  dictionary: {}
};

const metaData = reactive({
  meta: {},
});

export function useMock() {

  const mockApi = {
    setUrl() {},
    getUrl: () => window.location.hash.replace(/^#/, ''),
    getState: () => data.state,
    getMeta: () => metaData.meta,
    getDictionary: () => data.dictionary,
    setState: (state, versionId) => {
      // TODO: ensure the version id is passed in

      const newState = Array.isArray(state) ? state[0] : state;

      data.state = newState;

      setStorageItem(settings.currentConfigId, newState)
    },
    setName: async (name, versionId) => {
      // Set the name of the specified version
    },
    setMeta(newMeta){
      metaData.meta = Object.assign(metaData.meta, newMeta);
    },

    getConfiguration() {
        return data.configuration;
    },

    getVersions() {
      return data.versions;
    },

    // TODO: fix inject to prevent passing args as an array
    createVersion ([name, fromId]) {
      //TODO: throw an error if fromId isn't associated with this configuration
      const state = getStorageItem(fromId);

      const { id } = mockApi.getConfiguration();
      // Generate a random-ish id
      const newId = Date.now().toString(32);
      const newVersion = {
        id: newId,
        parentId: id,
        name,
        createdAt: new Date().toDateString(),
      };
      data.versions.push(newVersion);
      setStorageItem(newId, state);
      setcurrentConfigId(newVersion.id);

      logger.log(`Configuration '${name}' saved`);

      return newVersion;
    },

    deleteVersion: (_id) => {
      console.log(_id)
      // TODO: fix inject to prevent passing args as an array
      const [id] = _id;

      data.versions = data.versions.filter(configuration => configuration.id !== id);
      localSettings.versionIds = localSettings.versionIds.filter(versionId => versionId !== id);
      saveSettings();
      removeStorageItem(id);
    },

    loadConfiguration(_id) {
      // TODO: fix inject to prevent passing args as an array
      const [id] = _id;

      const state = getStorageItem(id);

      if (!state) return;

      setcurrentConfigId(id);
      mockApi.setState(state);
      return state;
    }
  };

  window.host = mockApi;

  function initialize(mockConfig, locales) {
    data.state = mockConfig.state;
    data.configuration = mockConfig.configuration;
    metaData.meta = mockConfig.meta;
    data.dictionary = locales;

    const storedSettings = getStorageItem('settings');

    if (storedSettings) {
      Object.assign(settings, storedSettings);
      loadConfiguration(mockConfig.configuration.id);
    } else {
      localSettings.currentConfigId = mockConfig.configuration.id;
      saveSettings();
    }

    if (!inject.hosted) {
      inject.mock(mockApi);
    }

  }

  /****************************** LOCAL STORAGE MANAGEMENT ******************************/

  function getStorageKey() {
    const appNameSlug = metaData.meta.configurator.name.replace(/\s/g, '-').toLowerCase();
    return [appNameSlug, name].join(':');
  }

  function getStorageItem(id) {
    const key = getStorageKey(id);
    const storedJSON = localStorage.getItem(key);

    try {
      return JSON.parse(storedJSON);
    } catch(e) {
      logger.log(`Cannot get item: '${key}'`, e);
    }
  }

  function setStorageItem(id, data) {
    const key = getStorageKey(id);
    localStorage.setItem(key, JSON.stringify(data));
  }

  function removeStorageItem(id) {
    const key = getStorageKey(id);
    localStorage.removeItem(key);
  }

  function localStorageBackup(appname) {
    const configname = settings.currentConfigId;
    var backup = {};
    for (let i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      var value = localStorage.getItem(key);
      backup[key] = escape(encodeURIComponent(value));
    }
    var json = JSON.stringify(backup);
    var base = window.btoa(json);
    var href = 'data:text/javascript;charset=utf-8;base64,' + base;
    var link = document.createElement('a');
      link.setAttribute('download', `${appname}_${configname}.json`);
    link.setAttribute('href', href);
    document.querySelector('body').appendChild(link);
    link.click();
    link.remove();
  }

  /****************************** SETTINGS MANAGEMENT ******************************/

  function setcurrentConfigId(name) {
    settings.currentConfigId = name;
    saveSettings();
  }

  function saveSettings() {
    setStorageItem('settings', settings);
  }

  /****************************** CONFIGURATION MANAGEMENT ******************************/

  function loadConfiguration(id = 1) {
    const state = getStorageItem(id);

    if (!state) return;

    setcurrentConfigId(id);
    mockApi.setState(state);
    return state;
  }

  function saveConfiguration(id, state) {
    setStorageItem(id, state);
  }

  function clearStorage() {
    const stateKey = metaData.meta.configurator.name;
    const deleteKeys = [];

    // Only clear storage for this app
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.slice(0, stateKey.length) === stateKey) {
        deleteKeys.push(key);
      }
    }

    deleteKeys.forEach(key => localStorage.removeItem(key));

    window.location.reload();
  }

  return {
    settings,
    initialize,
    loadConfiguration,
    saveConfiguration,
    clearStorage,
    localStorageBackup,
  }
}
