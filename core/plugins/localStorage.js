export function useLocalStorage(storageKey) {
  function _getStorageKey(name = 'Default') {
    return [storageKey, name].join(':');
  }

  function getItem(name) {
    const key = _getStorageKey(name);
    const storedJSON = localStorage.getItem(key);

    try {
      return JSON.parse(storedJSON);
    } catch(e) {
      logger.log(`Cannot get item: '${key}'`, e);
    }
  }

  function setItem(name, data) {
    const key = _getStorageKey(name);
    localStorage.setItem(key, JSON.stringify(data));
  }

  function removeItem(name) {
    const key = _getStorageKey(name);
    localStorage.removeItem(key);
  }

  function clear() {
    const deleteKeys = [];

    // Only clear storage for this app
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.slice(0, storageKey.length) === storageKey) {
        deleteKeys.push(key);
      }
    }

    deleteKeys.forEach(key => localStorage.removeItem(key));

    window.location.reload();
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear
  }
}
