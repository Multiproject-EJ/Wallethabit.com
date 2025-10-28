(function () {
  'use strict';

  var global = window;
  var AFF = global.AFF = global.AFF || {};

  var AFFIRMATIONS_KEY = 'affapp_affirmations_v1';
  var SESSIONS_KEY = 'affapp_sessions_v1';
  var SETTINGS_KEY = 'affapp_settings_v1';
  var QUEUE_KEY = 'affapp_queue_v1';
  var META_KEY = 'affapp_meta_v1';

  AFF.storage = {
    init: init,
    getAffirmations: getAffirmations,
    saveAffirmations: saveAffirmations,
    getSessions: getSessions,
    saveSessions: saveSessions,
    getSettings: getSettings,
    saveSettings: saveSettings,
    getQueue: getQueue,
    enqueue: enqueue,
    flushQueue: flushQueue,
    getMeta: getMeta,
    saveMeta: saveMeta
  };

  function init() {
    if (!supportsLocalStorage()) {
      console.warn('[Affirmations] localStorage unavailable. Guest mode disabled.');
    }
  }

  function getQueue() {
    return readJSON(QUEUE_KEY, []);
  }

  function supportsLocalStorage() {
    try {
      var key = '__affapp__';
      global.localStorage.setItem(key, '1');
      global.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function getAffirmations() {
    return readJSON(AFFIRMATIONS_KEY, []);
  }

  function saveAffirmations(list) {
    writeJSON(AFFIRMATIONS_KEY, list);
  }

  function getSessions() {
    return readJSON(SESSIONS_KEY, []);
  }

  function saveSessions(list) {
    writeJSON(SESSIONS_KEY, list);
  }

  function getSettings() {
    return readJSON(SETTINGS_KEY, {
      reminder_time: '07:30',
      reminder_days: [1, 2, 3, 4, 5],
      default_mode: 'read',
      audio_speed: 1
    });
  }

  function saveSettings(settings) {
    writeJSON(SETTINGS_KEY, settings);
  }

  function enqueue(item) {
    var queue = readJSON(QUEUE_KEY, []);
    var payload = Object.assign({ id: 'local-' + Date.now() + '-' + Math.random().toString(16).slice(2) }, item);
    queue.push(payload);
    writeJSON(QUEUE_KEY, queue);
    return payload;
  }

  function flushQueue(handler) {
    var queue = readJSON(QUEUE_KEY, []);
    if (!queue.length) {
      return Promise.resolve({ processed: 0, remaining: 0 });
    }
    var processed = 0;
    var remaining = [];
    var sequence = Promise.resolve();

    queue.forEach(function (item) {
      sequence = sequence.then(function () {
        return handler(item).then(function () {
          processed += 1;
        }).catch(function (error) {
          console.warn('[Affirmations] Queue item failed', error);
          remaining.push(item);
        });
      });
    });

    return sequence.then(function () {
      writeJSON(QUEUE_KEY, remaining);
      return { processed: processed, remaining: remaining.length };
    });
  }

  function getMeta() {
    return readJSON(META_KEY, { streak: 0, lastPracticeDate: null });
  }

  function saveMeta(meta) {
    writeJSON(META_KEY, meta);
  }

  function readJSON(key, fallback) {
    if (!supportsLocalStorage()) {
      return fallback;
    }
    try {
      var raw = global.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn('[Affirmations] Failed to parse storage key', key, error);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    if (!supportsLocalStorage()) {
      return;
    }
    try {
      global.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('[Affirmations] Failed to persist storage key', key, error);
    }
  }
})();
