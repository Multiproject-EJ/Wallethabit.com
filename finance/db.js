(function () {
  const DB_NAME = 'futurefunds_finance';
  const DB_VERSION = 1;
  const STORE_NAMES = ['transactions', 'budgets', 'goals', 'assets', 'liabilities', 'investments', 'settings'];
  let dbPromise;

  function open() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
          const database = event.target.result;
          if (!database.objectStoreNames.contains('transactions')) {
            database.createObjectStore('transactions', { keyPath: 'id' });
          }
          if (!database.objectStoreNames.contains('budgets')) {
            database.createObjectStore('budgets', { keyPath: 'id' });
          }
          if (!database.objectStoreNames.contains('goals')) {
            database.createObjectStore('goals', { keyPath: 'id' });
          }
          if (!database.objectStoreNames.contains('assets')) {
            database.createObjectStore('assets', { keyPath: 'id' });
          }
          if (!database.objectStoreNames.contains('liabilities')) {
            database.createObjectStore('liabilities', { keyPath: 'id' });
          }
          if (!database.objectStoreNames.contains('investments')) {
            database.createObjectStore('investments', { keyPath: 'id' });
          }
          if (!database.objectStoreNames.contains('settings')) {
            database.createObjectStore('settings', { keyPath: 'key' });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return dbPromise;
  }

  function tx(storeName, mode = 'readonly') {
    return open().then((database) => database.transaction(storeName, mode).objectStore(storeName));
  }

  async function getAll(storeName) {
    const store = await tx(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async function put(storeName, value) {
    const store = await tx(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function bulkPut(storeName, values) {
    if (!Array.isArray(values)) return [];
    const store = await tx(storeName, 'readwrite');
    return Promise.all(values.map((value) => new Promise((resolve, reject) => {
      const request = store.put(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    })));
  }

  async function del(storeName, key) {
    const store = await tx(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async function clear(storeName) {
    const store = await tx(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async function getSetting(key) {
    const store = await tx('settings');
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const record = request.result;
        resolve(record ? record.value : undefined);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async function setSetting(key, value) {
    const store = await tx('settings', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put({ key, value });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function exportAll() {
    const data = {};
    for (const storeName of STORE_NAMES) {
      data[storeName] = await getAll(storeName);
    }
    return data;
  }

  async function importAll(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid import payload');
    }
    for (const storeName of STORE_NAMES) {
      if (Array.isArray(payload[storeName])) {
        await clear(storeName);
        await bulkPut(storeName, payload[storeName]);
      }
    }
  }

  async function clearAll() {
    for (const storeName of STORE_NAMES) {
      await clear(storeName);
    }
  }

  window.FFDB = {
    open,
    getAll,
    put,
    bulkPut,
    del,
    getSetting,
    setSetting,
    exportAll,
    importAll,
    clearAll
  };
})();
