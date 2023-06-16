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
  meta: {},
  dictionary: {}
};

export function useMock() {

  const mockApi = {
    setUrl() {},
    getUrl: () => window.location.hash.replace(/^#/, ''),
    getState: () => data.state,
    getMeta: () => data.meta,
    getDictionary: () => data.dictionary,
    setState: (newState) => {
      data.state = newState;

      if (settings.autosave) {
        saveConfiguration(settings.currentConfig, newState)
      }
    },
    setName: async (name) => logger.log(name),
  };

  function initialize(mockConfig, locales) {
    data.state = mockConfig.state;
    data.meta = mockConfig.meta;
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
    const stateKey = data.meta.configurator.name;
    return [stateKey, name].join(':');
  }

  function getStorageItem(name) {
    const key = getStorageKey(name);
    const storedJSON = localStorage.getItem(key);

    try {
      return JSON.parse(storedJSON);
    } catch(e) {
      logger.log(`Cannot get item: '${key}'`, e);
    }
  }

  function setStorageItem(name, data) {
    const key = getStorageKey(name);
    localStorage.setItem(key, JSON.stringify(data));
  }

  function removeStorageItem(name) {
    const key = getStorageKey(name);
    localStorage.removeItem(key);
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
    settings.configurations = uniq([
      ...settings.configurations,
      configName
    ]);
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
    const stateKey = data.meta.configurator.name;
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
  }
}
