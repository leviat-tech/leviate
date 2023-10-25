import inject from '@crhio/inject';
import logger from './extensions/logger.js';
import { reactive } from 'vue';

const settings = reactive({
  autosave: false,
  configurations: [],
  currentConfig: '',
});

const data = {
  state: {},
  dictionary: {}
};

const metaData = reactive({  
  meta: {}, 
});

// function jsonifyNestedProxies (obj) {
//   return JSON.parse(JSON.stringify(obj))
// }

export function useMock() {

  const mockApi = {
    setUrl() {},
    getUrl: () => window.location.hash.replace(/^#/, ''),
    getState: () => data.state,
    getMeta: () => metaData.meta,
    getDictionary: () => data.dictionary,
    setState: (newState) => {
      data.state = newState;

      if (settings.autosave) {
        saveConfiguration(settings.currentConfig, newState)
      }
    },
    setName: async (name) => logger.log(name),
    setMeta(newMeta){
      metaData.meta = Object.assign(metaData.meta, newMeta);
    },
    
    getConfiguration() {
        console.log(settings.configurations[0]);
        return settings.configurations[0];
    },

    getVersions() {
      return settings.configurations;
    },

    createVersion (name, fromId) {
      //TODO: throw an error if fromId isn't associated with this configuration
      const from = fromId
        ? settings.configurations.value.versions.find(version => version.id === fromId)
        : settings.configurations.value
      
      // TODO: fix inject to prevent passing args as an array
      saveConfiguration(name[0]);
    },

    deleteVersion: (id) => {
      // TODO: fix inject to prevent passing args as an array
      deleteConfiguration(id[0]);
    },

    loadConfiguration(id) {
      const state = getStorageItem(id);

      if (!state) return;

      setCurrentConfig(id);
      setState(state);
      return state;
    }
  };

  window.host = mockApi;

  function initialize(mockConfig, locales) {
    data.state = mockConfig.state;
    metaData.meta = mockConfig.meta;
    data.dictionary = locales;

    const storedSettings = getStorageItem('settings');

    if (storedSettings) {
      Object.assign(settings, storedSettings);
      loadConfiguration(storedSettings.currentConfig);
    }

    if (!inject.hosted) {
      inject.mock(mockApi);
    }
  }

  /****************************** LOCAL STORAGE MANAGEMENT ******************************/

  function getStorageKey(name = 'Default') {
    const stateKey = metaData.meta.configurator.name;
    return [stateKey, name].join(':');
  }

  function getStorageItem(name) {
    console.log(name);
    const key = getStorageKey(name);
    const storedJSON = localStorage.getItem(key);
    console.log(key)

    try {
      return JSON.parse(storedJSON);
    } catch(e) {
      logger.log(`Cannot get item: '${key}'`, e);
    }
  }

  function setStorageItem(name, data) {
    console.log(data);
    const key = getStorageKey(name);
    localStorage.setItem(key, JSON.stringify(data));
  }

  function removeStorageItem(name) {
    const key = getStorageKey(name);
    localStorage.removeItem(key);
  }

  function localStorageBackup(appname) {
    const configname = settings.currentConfig;
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

  function setCurrentConfig(name) {
    settings.currentConfig = name;
    saveSettings();
  }

  function saveSettings() {
    setStorageItem('settings', settings);
  }

  /****************************** CONFIGURATION MANAGEMENT ******************************/

  function loadConfiguration(name = 'Default') {
    const state = getStorageItem(name);

    if (!state) return;

    setCurrentConfig(name);
    mockApi.setState(state);
    return state;
  }

  function saveConfiguration(name, newState) {
    mockApi.getConfiguration(name)
    // Generate a random-ish id
    const newVersion = {
      id: Date.now().toString(32),
      name,
      createdAt: new Date(),
    };
    settings.configurations.push(newVersion);
    console.log(settings.configurations);
    setStorageItem(name, newState);
    setCurrentConfig(newVersion.id);

    logger.log(`Configuration '${name}' saved`);
  }

  function deleteConfiguration(id) {
    settings.configurations = settings.configurations.filter(configuration => configuration.id !== id);
    saveSettings();
    removeStorageItem(id);
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
    deleteConfiguration,
    clearStorage,
    localStorageBackup,
  }
}
