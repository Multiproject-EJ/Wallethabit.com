(function () {
  'use strict';

  var global = window;
  var AFFDB = global.AFFDB = global.AFFDB || {};
  var cachedClient = null;

  AFFDB.createClient = function (config) {
    if (cachedClient) {
      return cachedClient;
    }
    if (!config || !config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
      console.warn('[Affirmations] Supabase configuration missing. Running in guest mode.');
      return null;
    }
    if (typeof AFFDB.__supabaseCreateClient !== 'function') {
      console.warn('[Affirmations] Supabase library not available. Running in guest mode.');
      return null;
    }
    cachedClient = AFFDB.__supabaseCreateClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
      auth: { persistSession: true },
      global: { headers: { 'X-Client-Info': 'affapp/1.0' } }
    });
    AFFDB.client = cachedClient;
    return cachedClient;
  };
})();
