(function () {
  'use strict';

  var AFF = window.AFF = window.AFF || {};

  var deferredPrompt = null;

  AFF.pwa = {
    init: init,
    promptInstall: promptInstall
  };

  function init() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(function (error) {
        console.warn('[Affirmations] Service worker registration failed:', error);
      });
    }

    window.addEventListener('beforeinstallprompt', function (event) {
      event.preventDefault();
      deferredPrompt = event;
      if (AFF.ui && typeof AFF.ui.setInstallAvailable === 'function') {
        AFF.ui.setInstallAvailable(true);
      }
    });

    window.addEventListener('appinstalled', function () {
      deferredPrompt = null;
      if (AFF.ui && typeof AFF.ui.setInstallAvailable === 'function') {
        AFF.ui.setInstallAvailable(false);
      }
      if (AFF.ui && typeof AFF.ui.toast === 'function') {
        AFF.ui.toast('Affirmations installed! You can now open it from your home screen.');
      }
    });
  }

  function promptInstall() {
    if (!deferredPrompt) {
      if (AFF.ui && typeof AFF.ui.toast === 'function') {
        AFF.ui.toast('Install prompt is not available yet.');
      }
      return;
    }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () {
      deferredPrompt = null;
      if (AFF.ui && typeof AFF.ui.setInstallAvailable === 'function') {
        AFF.ui.setInstallAvailable(false);
      }
    });
  }
})();
