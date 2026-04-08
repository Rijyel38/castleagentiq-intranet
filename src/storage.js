/**
 * Storage shim — replaces Claude's window.storage API with localStorage.
 * Drop-in compatible: artifacts using window.storage.get/set/delete/list
 * will work without code changes.
 *
 * When ConnectIQ is live, replace this with API calls to the real backend.
 */

const PREFIX = "ciq_";
const STORE = globalThis.localStorage;

const storage = {
  async get(key) {
    const val = STORE.getItem(PREFIX + key);
    if (val === null) throw new Error(`Key not found: ${key}`);
    return { key, value: val, shared: false };
  },

  async set(key, value) {
    STORE.setItem(PREFIX + key, value);
    return { key, value, shared: false };
  },

  async delete(key) {
    STORE.removeItem(PREFIX + key);
    return { key, deleted: true, shared: false };
  },

  async list(prefix = "") {
    const keys = [];
    for (let i = 0; i < STORE.length; i++) {
      const k = STORE.key(i);
      if (k.startsWith(PREFIX + prefix)) {
        keys.push(k.slice(PREFIX.length));
      }
    }
    return { keys, prefix, shared: false };
  },
};

// Install globally so artifacts see it as window.storage
if (typeof window !== "undefined") {
  window.storage = storage;
}

export default storage;
