(function () {
  'use strict';

  var AFFDB = window.AFFDB = window.AFFDB || {};

  AFFDB.getProfile = function () {
    var client = getClient();
    if (!client) {
      return Promise.resolve(null);
    }
    return client.from('user_profiles').select('*').maybeSingle().then(handleResult);
  };

  AFFDB.upsertProfile = function (profile) {
    var client = getClient();
    if (!client) {
      return Promise.resolve(profile);
    }
    return client.from('user_profiles').upsert(profile, { onConflict: 'user_id' }).select('*').maybeSingle().then(handleResult);
  };

  AFFDB.listAffirmations = function () {
    var client = getClient();
    if (!client) {
      return Promise.resolve([]);
    }
    return client
      .from('affirmations')
      .select('*')
      .order('created_at', { ascending: false })
      .then(handleResult);
  };

  AFFDB.createAffirmation = function (payload) {
    var client = getClient();
    if (!client) {
      return Promise.reject(new Error('Supabase client unavailable'));
    }
    return client.from('affirmations').insert(payload).select('*').single().then(handleResult);
  };

  AFFDB.updateAffirmation = function (id, updates) {
    var client = getClient();
    if (!client) {
      return Promise.reject(new Error('Supabase client unavailable'));
    }
    return client.from('affirmations').update(updates).eq('id', id).select('*').single().then(handleResult);
  };

  AFFDB.toggleAffirmation = function (id, isActive) {
    return AFFDB.updateAffirmation(id, { is_active: isActive });
  };

  AFFDB.logSession = function (payload) {
    var client = getClient();
    if (!client) {
      return Promise.reject(new Error('Supabase client unavailable'));
    }
    return client.from('affirmation_sessions').upsert(payload, { onConflict: 'user_id,affirmation_id,practiced_at,mode' }).select('*').single().then(handleResult);
  };

  AFFDB.listSessionsByMonth = function (year, month) {
    var client = getClient();
    if (!client) {
      return Promise.resolve([]);
    }
    var start = new Date(Date.UTC(year, month - 1, 1));
    var end = new Date(Date.UTC(year, month, 0, 23, 59, 59));
    return client
      .from('affirmation_sessions')
      .select('*')
      .gte('practiced_at', start.toISOString().slice(0, 10))
      .lte('practiced_at', end.toISOString().slice(0, 10))
      .order('practiced_at', { ascending: true })
      .then(handleResult);
  };

  AFFDB.getAllSessions = function () {
    var client = getClient();
    if (!client) {
      return Promise.resolve([]);
    }
    return client
      .from('affirmation_sessions')
      .select('*')
      .order('practiced_at', { ascending: false })
      .limit(365)
      .then(handleResult);
  };

  AFFDB.getStreak = function () {
    return AFFDB.getAllSessions().then(function (sessions) {
      return computeStreak(sessions || []);
    });
  };

  AFFDB.getSettings = function () {
    var client = getClient();
    if (!client) {
      return Promise.resolve(null);
    }
    return client.from('user_settings').select('*').maybeSingle().then(handleResult);
  };

  AFFDB.updateSettings = function (payload) {
    var client = getClient();
    if (!client) {
      return Promise.reject(new Error('Supabase client unavailable'));
    }
    return client.from('user_settings').upsert(payload, { onConflict: 'user_id' }).select('*').maybeSingle().then(handleResult);
  };

  AFFDB.syncLocalQueueToServer = function (items, userId) {
    if (!items || !items.length) {
      return Promise.resolve({ processed: 0, remaining: 0 });
    }
    var client = getClient();
    if (!client) {
      return Promise.reject(new Error('Supabase client unavailable'));
    }
    var processed = 0;
    var sequence = Promise.resolve();

    items.forEach(function (item) {
      sequence = sequence.then(function () {
        if (item.type === 'affirmation') {
          var affirmation = Object.assign({}, item.payload, { user_id: userId });
          if (item.action === 'create') {
            return AFFDB.createAffirmation(affirmation).then(function () {
              processed += 1;
            });
          }
          if (item.action === 'update') {
            return AFFDB.updateAffirmation(affirmation.id, affirmation).then(function () {
              processed += 1;
            });
          }
        }
        if (item.type === 'session') {
          var session = Object.assign({}, item.payload, { user_id: userId });
          return AFFDB.logSession(session).then(function () {
            processed += 1;
          });
        }
        if (item.type === 'settings') {
          var settings = Object.assign({}, item.payload, { user_id: userId });
          return AFFDB.updateSettings(settings).then(function () {
            processed += 1;
          });
        }
        return Promise.resolve();
      });
    });

    return sequence.then(function () {
      return { processed: processed, remaining: Math.max(0, items.length - processed) };
    });
  };

  function computeStreak(sessions) {
    if (!sessions || !sessions.length) {
      return { streak: 0, lastPracticeDate: null };
    }
    var sorted = sessions
      .map(function (session) { return session.practiced_at; })
      .filter(Boolean)
      .sort(function (a, b) { return new Date(b) - new Date(a); });
    var today = new Date();
    var pointer = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    var streak = 0;

    for (var i = 0; i < sorted.length; i += 1) {
      var date = new Date(sorted[i] + 'T00:00:00Z');
      if (sameDay(date, pointer)) {
        streak += 1;
        pointer.setUTCDate(pointer.getUTCDate() - 1);
      } else if (date < pointer) {
        break;
      } else if (date > pointer) {
        continue;
      }
    }

    return { streak: streak, lastPracticeDate: sorted[0] };
  }

  function sameDay(a, b) {
    return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
  }

  function getClient() {
    return AFFDB.client || null;
  }

  function handleResult(result) {
    if (!result) {
      return null;
    }
    if (result.error) {
      throw result.error;
    }
    return result.data === undefined ? result : result.data;
  }
})();
