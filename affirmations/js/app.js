(function () {
  'use strict';

  var AFF = window.AFF = window.AFF || {};
  var AFFDB = window.AFFDB = window.AFFDB || {};

  var config = window.__AFF_CFG__ || {};
  var ttsUtterance = null;

  var THEMES = ['sand', 'dark', 'bliss'];
  var THEME_LABELS = {
    sand: 'Sand',
    dark: 'Midnight',
    bliss: 'Bliss'
  };

  var state = {
    route: parseRoute(window.location.hash),
    affirmations: [],
    sessions: [],
    settings: {},
    createCategory: 'finance',
    createDraft: { title: '', text: '' },
    practiceSelection: null,
    practiceMode: 'read',
    historyMonth: null,
    historyYear: null,
    queueStatus: { pending: 0 },
    streak: { streak: 0, lastPracticeDate: null },
    isOnline: navigator.onLine,
    user: null,
    highContrast: false,
    theme: 'sand'
  };

  AFF.state = state;

  AFF.actions = {
    saveAffirmation: saveAffirmation,
    setCreateCategory: setCreateCategory,
    updateDraft: updateDraft,
    setPracticeSelection: setPracticeSelection,
    setPracticeMode: setPracticeMode,
    logSession: logSession,
    saveSettings: saveSettings,
    requestMagicLink: requestMagicLink,
    signOut: signOut,
    syncNow: syncNow,
    toggleAffirmation: toggleAffirmation,
    updateAffirmation: updateAffirmation,
    shiftHistoryMonth: shiftHistoryMonth,
    playTextToSpeech: playTextToSpeech,
    toggleContrast: toggleContrast,
    cycleTheme: cycleTheme
  };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    AFF.storage.init();
    state.settings = AFF.storage.getSettings();
    state.affirmations = AFF.storage.getAffirmations();
    state.sessions = AFF.storage.getSessions();
    state.queueStatus = { pending: AFF.storage.getQueue().length };
    state.theme = AFF.storage.getTheme();
    var today = new Date();
    state.historyMonth = today.getUTCMonth() + 1;
    state.historyYear = today.getUTCFullYear();
    state.streak = computeLocalStreak(state.sessions);
    if (document && document.documentElement) {
      document.documentElement.setAttribute('data-affapp-theme', state.theme);
    }

    AFF.ui.init(AFF);
    AFF.ui.highlightRoute(state.route);
    AFF.ui.applyTheme(state.theme);
    AFF.ui.render(state);
    AFF.ui.setStatus('Ready in guest mode.');
    AFF.ui.updateAuthBadge('Guest mode', 'info');
    AFF.ui.updateSyncStatus(state.isOnline ? 'Online' : 'Offline');
    if (state.highContrast) {
      document.body.classList.add('affapp-high-contrast');
    }

    if (AFF.pwa && typeof AFF.pwa.init === 'function') {
      AFF.pwa.init();
    }

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    bootstrapSupabase();
  }

  function bootstrapSupabase() {
    try {
      var client = AFFDB.createClient(config);
      if (!client) {
        return;
      }
      client.auth.getSession().then(function (result) {
        var session = result && result.data ? result.data.session : null;
        handleSessionChange(session);
      });
      client.auth.onAuthStateChange(function (event, session) {
        handleSessionChange(session);
      });
    } catch (error) {
      console.warn('[Affirmations] Unable to initialize Supabase', error);
    }
  }

  function handleSessionChange(session) {
    state.user = session && session.user ? session.user : null;
    if (state.user) {
      AFF.ui.updateAuthBadge('Signed in', 'success');
      AFF.ui.toast('Signed in. Syncing affirmations...');
      syncFromRemote();
      syncQueue();
    } else {
      AFF.ui.updateAuthBadge('Guest mode', 'info');
    }
    render();
  }

  function syncFromRemote() {
    if (!AFFDB.client || !state.user) {
      return;
    }
    AFF.ui.setStatus('Syncing with Supabase...');
    Promise.all([
      AFFDB.listAffirmations(),
      AFFDB.getAllSessions(),
      AFFDB.getSettings(),
      AFFDB.getStreak()
    ]).then(function (results) {
      var affirmations = results[0] || [];
      var sessions = results[1] || [];
      var settings = results[2] || state.settings;
      var streak = results[3] || computeLocalStreak(sessions);
      state.affirmations = affirmations;
      state.sessions = sessions;
      state.settings = Object.assign({}, state.settings, settings || {});
      state.streak = streak;
      state.practiceSelection = state.practiceSelection || (affirmations[0] ? affirmations[0].id : null);
      AFF.storage.saveAffirmations(affirmations);
      AFF.storage.saveSessions(sessions);
      AFF.storage.saveSettings(state.settings);
      AFF.storage.saveMeta(streak);
      AFF.ui.setStatus('Synced with Supabase.');
      render();
    }).catch(function (error) {
      console.warn('[Affirmations] Sync failed', error);
      AFF.ui.setStatus('Sync failed. Data available offline.');
    });
  }

  function handleHashChange() {
    state.route = parseRoute(window.location.hash);
    AFF.ui.highlightRoute(state.route);
    render();
  }

  function handleConnectionChange() {
    state.isOnline = navigator.onLine;
    AFF.ui.updateSyncStatus(state.isOnline ? 'Online' : 'Offline');
    if (state.isOnline && state.user) {
      syncQueue();
    }
  }

  function render() {
    AFF.ui.render(state);
  }

  function cycleTheme() {
    var currentIndex = THEMES.indexOf(state.theme);
    if (currentIndex === -1) {
      currentIndex = 0;
    }
    var next = THEMES[(currentIndex + 1) % THEMES.length];
    state.theme = next;
    AFF.storage.saveTheme(next);
    AFF.ui.applyTheme(next);
    var label = THEME_LABELS[next] || 'Theme';
    AFF.ui.setStatus('Theme switched to ' + label + '.');
  }

  function saveAffirmation(payload) {
    var id = payload.id || generateId();
    var record = Object.assign({
      id: id,
      category: payload.category,
      title: payload.title,
      text: payload.text,
      is_active: payload.is_active !== false,
      created_at: payload.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, payload);

    if (state.user && AFFDB.client) {
      AFFDB.createAffirmation(Object.assign({}, record, { user_id: state.user.id })).then(function (created) {
        upsertAffirmation(created || record);
        AFF.ui.toast('Affirmation saved.');
        state.createDraft = { title: '', text: '' };
        render();
      }).catch(function (error) {
        console.warn('[Affirmations] Save failed', error);
        queueAffirmation(record, state.user.id, 'create');
        AFF.ui.toast('Saved offline. Will sync when online.');
        upsertAffirmation(record);
        render();
      });
    } else {
      queueAffirmation(record, null, 'create');
      upsertAffirmation(record);
      state.createDraft = { title: '', text: '' };
      AFF.ui.toast('Affirmation saved locally. Sign in to sync.');
      render();
    }
  }

  function upsertAffirmation(record) {
    var existingIndex = state.affirmations.findIndex(function (item) { return item.id === record.id; });
    if (existingIndex !== -1) {
      state.affirmations.splice(existingIndex, 1, Object.assign({}, state.affirmations[existingIndex], record));
    } else {
      state.affirmations.unshift(record);
    }
    AFF.storage.saveAffirmations(state.affirmations);
    if (!state.practiceSelection) {
      state.practiceSelection = record.id;
    }
    updateQueueStatus();
  }

  function setCreateCategory(category) {
    state.createCategory = category;
    render();
  }

  function updateDraft(name, value) {
    state.createDraft = Object.assign({}, state.createDraft, (function () {
      var update = {};
      update[name] = value;
      return update;
    })());
  }

  function setPracticeSelection(id) {
    state.practiceSelection = id;
    render();
  }

  function setPracticeMode(mode) {
    state.practiceMode = mode;
    render();
  }

  function logSession(payload) {
    var id = payload.id || generateId();
    var record = Object.assign({
      id: id,
      user_id: state.user ? state.user.id : null,
      practiced_at: payload.practiced_at,
      affirmation_id: payload.affirmation_id,
      mode: payload.mode,
      mood_before: payload.mood_before,
      mood_after: payload.mood_after,
      notes: payload.notes,
      created_at: new Date().toISOString()
    }, payload);

    var addLocalSession = function () {
      state.sessions.unshift(record);
      state.sessions = state.sessions.slice(0, 200);
      AFF.storage.saveSessions(state.sessions);
      state.streak = computeLocalStreak(state.sessions);
      AFF.storage.saveMeta(state.streak);
      AFF.ui.toast('Session logged.');
      if (state.streak && state.streak.streak && state.streak.streak % 7 === 0) {
        AFF.ui.showConfetti();
      }
      render();
    };

    if (state.user && AFFDB.client) {
      AFFDB.logSession(Object.assign({}, record, { user_id: state.user.id })).then(function (created) {
        record = created || record;
        addLocalSession();
        updateQueueStatus();
      }).catch(function (error) {
        console.warn('[Affirmations] Session log failed', error);
        queueSession(record);
        addLocalSession();
      });
    } else {
      queueSession(record);
      addLocalSession();
    }
  }

  function saveSettings(payload) {
    state.settings = Object.assign({}, state.settings, payload);
    AFF.storage.saveSettings(state.settings);
    AFF.ui.toast('Settings updated.');
    render();

    if (state.user && AFFDB.client) {
      AFFDB.updateSettings(Object.assign({}, payload, { user_id: state.user.id })).then(function () {
        updateQueueStatus();
      }).catch(function (error) {
        console.warn('[Affirmations] Settings sync failed', error);
        queueSettings(payload);
      });
    } else {
      queueSettings(payload);
    }
  }

  function requestMagicLink(email) {
    if (!email) {
      return;
    }
    if (!AFFDB.client) {
      AFF.ui.toast('Supabase client unavailable.');
      return;
    }
    AFFDB.client.auth.signInWithOtp({ email: email, options: { emailRedirectTo: window.location.href } }).then(function () {
      AFF.ui.toast('Magic link sent! Check your inbox.');
    }).catch(function (error) {
      console.warn('[Affirmations] Magic link error', error);
      AFF.ui.toast('Unable to send magic link.');
    });
  }

  function signOut() {
    if (!AFFDB.client) {
      return;
    }
    AFFDB.client.auth.signOut().then(function () {
      AFF.ui.toast('Signed out. Data is still saved locally.');
    }).catch(function (error) {
      console.warn('[Affirmations] Sign out failed', error);
    });
  }

  function syncNow() {
    syncQueue();
  }

  function toggleAffirmation(id, isActive) {
    var affirmation = state.affirmations.find(function (item) { return item.id === id; });
    if (!affirmation) {
      return;
    }
    affirmation.is_active = isActive;
    affirmation.updated_at = new Date().toISOString();
    AFF.storage.saveAffirmations(state.affirmations);
    render();

    if (state.user && AFFDB.client) {
      AFFDB.toggleAffirmation(id, isActive).catch(function (error) {
        console.warn('[Affirmations] Toggle failed', error);
        queueAffirmation(affirmation, state.user.id, 'update');
      });
    } else {
      queueAffirmation(affirmation, null, 'update');
    }
  }

  function updateAffirmation(id, updates) {
    var affirmation = state.affirmations.find(function (item) { return item.id === id; });
    if (!affirmation) {
      return;
    }
    Object.assign(affirmation, updates, { updated_at: new Date().toISOString() });
    AFF.storage.saveAffirmations(state.affirmations);
    AFF.ui.toast('Affirmation updated.');
    render();

    if (state.user && AFFDB.client) {
      AFFDB.updateAffirmation(id, updates).catch(function (error) {
        console.warn('[Affirmations] Update failed', error);
        queueAffirmation(affirmation, state.user.id, 'update');
      });
    } else {
      queueAffirmation(affirmation, null, 'update');
    }
  }

  function shiftHistoryMonth(delta) {
    var month = state.historyMonth + delta;
    var year = state.historyYear;
    if (month < 1) {
      month = 12;
      year -= 1;
    } else if (month > 12) {
      month = 1;
      year += 1;
    }
    state.historyMonth = month;
    state.historyYear = year;
    render();
  }

  function playTextToSpeech(text) {
    if (!('speechSynthesis' in window)) {
      AFF.ui.toast('Text-to-speech not supported on this device.');
      return;
    }
    window.speechSynthesis.cancel();
    var utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = clamp(Number(state.settings.audio_speed || 1), 0.5, 2);
    ttsUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function toggleContrast() {
    state.highContrast = !state.highContrast;
    document.body.classList.toggle('affapp-high-contrast', state.highContrast);
    render();
  }

  function syncQueue() {
    var queue = AFF.storage.getQueue();
    if (!queue.length) {
      updateQueueStatus();
      AFF.ui.toast('All caught up.');
      return Promise.resolve();
    }
    if (!state.user || !AFFDB.client) {
      AFF.ui.toast('Sign in to sync ' + queue.length + ' pending item' + (queue.length > 1 ? 's' : '') + '.');
      updateQueueStatus();
      return Promise.resolve();
    }
    AFF.ui.setStatus('Syncing ' + queue.length + ' items...');
    return AFF.storage.flushQueue(function (item) {
      if (item.type === 'affirmation') {
        var affPayload = Object.assign({}, item.payload, { user_id: state.user.id, is_active: item.payload.is_active !== false });
        if (item.action === 'create') {
          return AFFDB.createAffirmation(affPayload);
        }
        return AFFDB.updateAffirmation(affPayload.id, affPayload);
      }
      if (item.type === 'session') {
        return AFFDB.logSession(Object.assign({}, item.payload, { user_id: state.user.id }));
      }
      if (item.type === 'settings') {
        return AFFDB.updateSettings(Object.assign({}, item.payload, { user_id: state.user.id }));
      }
      return Promise.resolve();
    }).then(function () {
      AFF.ui.setStatus('Sync complete.');
      updateQueueStatus();
      syncFromRemote();
    }).catch(function (error) {
      console.warn('[Affirmations] Queue sync error', error);
      AFF.ui.setStatus('Unable to sync all items.');
      updateQueueStatus();
    });
  }

  function queueAffirmation(record, userId, action) {
    AFF.storage.enqueue({ type: 'affirmation', action: action || 'update', payload: stripUser(record), user_id: userId });
    updateQueueStatus();
  }

  function queueSession(record) {
    AFF.storage.enqueue({ type: 'session', action: 'create', payload: stripUser(record) });
    updateQueueStatus();
  }

  function queueSettings(payload) {
    AFF.storage.enqueue({ type: 'settings', action: 'update', payload: payload });
    updateQueueStatus();
  }

  function updateQueueStatus() {
    var pending = AFF.storage.getQueue().length;
    state.queueStatus = { pending: pending };
    AFF.ui.updateSyncStatus((state.isOnline ? 'Online · ' : 'Offline · ') + pending + ' pending');
  }

  function parseRoute(hash) {
    var value = (hash || '').replace('#/', '');
    if (!value) {
      return 'create';
    }
    if (['create', 'practice', 'history', 'settings'].indexOf(value) === -1) {
      return 'create';
    }
    return value;
  }

  function computeLocalStreak(list) {
    if (!list || !list.length) {
      return { streak: 0, lastPracticeDate: null };
    }
    var sorted = list.slice().sort(function (a, b) {
      return new Date(b.practiced_at) - new Date(a.practiced_at);
    });
    var today = new Date();
    var pointer = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    var streak = 0;
    var lastDate = null;
    for (var i = 0; i < sorted.length; i += 1) {
      var date = new Date(sorted[i].practiced_at + 'T00:00:00Z');
      if (!lastDate) {
        lastDate = sorted[i].practiced_at;
      }
      if (sameDay(date, pointer)) {
        streak += 1;
        pointer.setUTCDate(pointer.getUTCDate() - 1);
      } else if (date < pointer) {
        break;
      }
    }
    return { streak: streak, lastPracticeDate: lastDate };
  }

  function sameDay(a, b) {
    return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
  }

  function generateId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'local-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  function stripUser(record) {
    var clone = Object.assign({}, record);
    delete clone.user_id;
    return clone;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
})();
