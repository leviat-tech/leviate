import inject from '@crhio/inject';
import logger from './extensions/logger.js';
import { reactive } from 'vue';
import { uniq } from 'lodash-es';

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
    const configName = name || settings.currentConfig || 'Default';
    const id = 4
    const createdAt = new Date().toDateString()
    const versions = []
    settings.configurations = [{
      configName,
      id,
      createdAt,
      versions
    }];
    setStorageItem(configName, newState);
    setCurrentConfig(configName);

    logger.log(`Configuration '${configName}' saved`);
  }

  function deleteConfiguration(name) {
    settings.configurations = settings.configurations.filter(configuration => configuration !== name);
    saveSettings();
    removeStorageItem(name);
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

  function getVersions (name) {
    const state = getStorageItem(name);

    if (!state) return;

    setCurrentConfig(name);
    mockApi.setState(state);

    console.log(state);

    return state;
  }

  // function createVersion (name, newState) {
  //   const configName = name || settings.currentConfig || 'Default';
   
  //   settings.configurations = uniq([
  //     ...settings.configurations,
  //     configName,
  //   ]);

  //   setStorageItem(configName, newState);
  //   setCurrentConfig(configName);

  //   logger.log(`Configuration '${configName}' saved`);
  // }

  function createVersion (name, fromId) {
    //TODO: throw an error if fromId isn't associated with this configuration
    const from = fromId
      ? settings.configurations.value.versions.find(version => version.id === fromId)
      : settings.configurations.value
    console.log('creating version')
    //post({ ...from, name, parentId: rootId })
  }

  function deleteVersion (name) {
    settings.configurations = settings.configurations.filter(configuration => configuration !== name);
    saveSettings();
    removeStorageItem(name);
  }

  return {
    settings,
    initialize,
    loadConfiguration,
    saveConfiguration,
    deleteConfiguration,
    clearStorage,
    localStorageBackup,
    getVersions,
    createVersion,
    deleteVersion
  }
}
