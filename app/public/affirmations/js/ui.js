(function () {
  'use strict';

  var AFF = window.AFF = window.AFF || {};

  var mainEl;
  var statusEl;
  var authEl;
  var syncEl;
  var syncBtn;
  var installBtn;
  var toastEl;
  var navTabs;

  var installAvailable = false;

  AFF.ui = {
    init: init,
    render: render,
    setStatus: setStatus,
    updateAuthBadge: updateAuthBadge,
    updateSyncStatus: updateSyncStatus,
    toast: toast,
    setInstallAvailable: setInstallAvailable,
    highlightRoute: highlightRoute,
    showConfetti: showConfetti
  };

  function init(app) {
    mainEl = document.getElementById('affapp-main');
    statusEl = document.getElementById('affapp-status');
    authEl = document.getElementById('affapp-auth-state');
    syncEl = document.getElementById('affapp-sync-state');
    syncBtn = document.getElementById('affapp-sync-now');
    navTabs = Array.prototype.slice.call(document.querySelectorAll('.affapp-tab'));

    if (syncBtn) {
      syncBtn.addEventListener('click', function () {
        if (AFF.actions && typeof AFF.actions.syncNow === 'function') {
          AFF.actions.syncNow();
        }
      });
    }

    document.body.addEventListener('click', function (event) {
      var target = event.target;
      if (target && target.matches('[data-action="affapp-install"]')) {
        event.preventDefault();
        if (AFF.pwa && typeof AFF.pwa.promptInstall === 'function') {
          AFF.pwa.promptInstall();
        }
      }
    });

    highlightRoute('create');
  }

  function render(state) {
    if (!mainEl) {
      return;
    }
    if (state.route === 'create') {
      renderCreate(state);
    } else if (state.route === 'practice') {
      renderPractice(state);
    } else if (state.route === 'history') {
      renderHistory(state);
    } else if (state.route === 'settings') {
      renderSettings(state);
    }
  }

  function renderCreate(state) {
    var templates = AFF.templates ? AFF.templates.getAll() : {};
    var why = AFF.templates ? AFF.templates.getWhy() : [];
    var selected = state.createCategory || 'finance';
    var preview = state.createPreview || buildPreviewText(selected, state.createDraft || {}, templates);
    var draft = state.createDraft || { title: '', text: '' };

    mainEl.innerHTML = '' +
      '<section class="affapp-section affapp-columns">' +
      '  <div>' +
      '    <h1>Craft your daily affirmation</h1>' +
      '    <p class="affapp-subtle">Choose a focus, tailor the language, and see the message update in real time.</p>' +
      '    <form id="affapp-create-form" class="affapp-fieldset" novalidate>' +
      '      <div class="affapp-field">' +
      '        <span class="affapp-label">Focus area</span>' +
      '        <div class="affapp-pill-group" role="radiogroup">' + renderCategoryPills(templates, selected) + '</div>' +
      '      </div>' +
      '      <label class="affapp-field">' +
      '        <span class="affapp-label">Affirmation title</span>' +
      '        <input class="affapp-input" name="title" value="' + escapeHtml(draft.title || '') + '" required maxlength="80" placeholder="Money wins today">' +
      '      </label>' +
      '      <label class="affapp-field">' +
      '        <span class="affapp-label">Affirmation text</span>' +
      '        <textarea class="affapp-textarea" name="text" required maxlength="250" placeholder="I celebrate how I..."></textarea>' +
      '      </label>' +
      '      <div class="affapp-inline">' +
      '        <button type="submit" class="affapp-primary">Save affirmation</button>' +
      '        <button type="button" class="affapp-secondary" data-action="affapp-use-template">Use template</button>' +
      '      </div>' +
      '    </form>' +
      '  </div>' +
      '  <aside>' +
      '    <div class="affapp-preview" id="affapp-live-preview">' + escapeHtml(preview || '') + '</div>' +
      '    <div class="affapp-card" style="margin-top:1.25rem;">' +
      '      <header>' +
      '        <h2>Why this works</h2>' +
      '        <p class="affapp-subtle">Keep these principles in mind as you write.</p>' +
      '      </header>' +
      '      <ul class="affapp-list" id="affapp-why">' + why.map(function (line) { return '<li class="affapp-list-item">' + escapeHtml(line) + '</li>'; }).join('') + '</ul>' +
      '    </div>' +
      '  </aside>' +
      '</section>' +
      '<section class="affapp-section">' +
      '  <header class="affapp-inline" style="justify-content: space-between;">' +
      '    <div>' +
      '      <h2>Your affirmations</h2>' +
      '      <p class="affapp-subtle">Toggle active statements to control what appears in practice mode.</p>' +
      '    </div>' +
      '    <span class="affapp-chip">' + state.affirmations.length + ' saved</span>' +
      '  </header>' +
      renderAffirmationList(state.affirmations) +
      '</section>';

    var form = document.getElementById('affapp-create-form');
    if (form) {
      var textarea = form.querySelector('textarea[name="text"]');
      if (textarea) {
        textarea.value = draft.text || '';
        textarea.addEventListener('input', handleDraftChange);
      }
      var titleInput = form.querySelector('input[name="title"]');
      if (titleInput) {
        titleInput.addEventListener('input', handleDraftChange);
      }
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var formData = new window.FormData(form);
        var payload = {
          title: String(formData.get('title') || '').trim(),
          text: String(formData.get('text') || '').trim(),
          category: selected,
          is_active: true
        };
        if (!payload.title || !payload.text) {
          toast('Add a title and affirmation text before saving.');
          return;
        }
        if (AFF.actions && typeof AFF.actions.saveAffirmation === 'function') {
          AFF.actions.saveAffirmation(payload);
        }
      });
      var templateBtn = form.querySelector('[data-action="affapp-use-template"]');
      if (templateBtn) {
        templateBtn.addEventListener('click', function () {
          var template = templates[selected];
          if (!template) {
            return;
          }
          var previewText = template.template
            .replace('{action}', 'track every euro')
            .replace('{outcome}', 'fund the life I value')
            .replace('{habit}', 'fuel my body with real food')
            .replace('{feeling}', 'strong and rested')
            .replace('{strength}', 'strategic creativity')
            .replace('{impact}', 'meaningful change')
            .replace('{quality}', 'presence')
            .replace('{result}', 'seen and supported')
            .replace('{identity}', 'an intentional creator');
          if (textarea) {
            textarea.value = previewText;
            textarea.dispatchEvent(new Event('input'));
          }
        });
      }
    }

    var pills = mainEl.querySelectorAll('.affapp-pill');
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        var value = pill.getAttribute('data-value');
        if (value) {
          if (AFF.actions && typeof AFF.actions.setCreateCategory === 'function') {
            AFF.actions.setCreateCategory(value);
          }
        }
      });
    });

    var toggleButtons = mainEl.querySelectorAll('[data-action="affapp-toggle-affirmation"]');
    toggleButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-id');
        var active = button.getAttribute('data-active') === 'true';
        if (AFF.actions && typeof AFF.actions.toggleAffirmation === 'function') {
          AFF.actions.toggleAffirmation(id, !active);
        }
      });
    });
  }

  function renderPractice(state) {
    var active = state.affirmations.filter(function (item) { return item.is_active !== false; });
    var selectedId = state.practiceSelection || (active[0] ? active[0].id : null);
    var selected = active.find(function (item) { return item.id === selectedId; }) || active[0];
    var mode = state.practiceMode || state.settings.default_mode || 'read';

    mainEl.innerHTML = '' +
      '<section class="affapp-section affapp-columns">' +
      '  <div>' +
      '    <h1>Daily practice</h1>' +
      '    <p class="affapp-subtle">Choose a mode, log your session, and keep the streak alive.</p>' +
      renderPracticeAffirmations(active, selected) +
      '  </div>' +
      '  <aside>' +
      '    <div class="affapp-card">' +
      '      <h2>Mode</h2>' +
      '      <div class="affapp-mode-grid" role="radiogroup">' +
      renderModeOptions(mode) +
      '      </div>' +
      '    </div>' +
      '    <div class="affapp-card">' +
      '      <h2>Log today</h2>' +
      '      <form id="affapp-practice-form" class="affapp-fieldset">' +
      '        <label class="affapp-field">' +
      '          <span class="affapp-label">Mood before</span>' +
      '          <select class="affapp-select" name="mood_before">' + renderMoodOptions() + '</select>' +
      '        </label>' +
      '        <label class="affapp-field">' +
      '          <span class="affapp-label">Mood after</span>' +
      '          <select class="affapp-select" name="mood_after">' + renderMoodOptions() + '</select>' +
      '        </label>' +
      '        <label class="affapp-field">' +
      '          <span class="affapp-label">Notes</span>' +
      '          <textarea class="affapp-textarea" name="notes" placeholder="What shifted for you?"></textarea>' +
      '        </label>' +
      '        <button type="submit" class="affapp-primary">Log session</button>' +
      '      </form>' +
      '    </div>' +
      '    <div class="affapp-card">' +
      '      <div class="affapp-metric-row">' +
      '        <div>' +
      '          <h2>Current streak</h2>' +
      '          <p class="affapp-subtle">' + (state.streak && state.streak.lastPracticeDate ? 'Last practice ' + formatRelative(state.streak.lastPracticeDate) : 'No sessions yet.') + '</p>' +
      '        </div>' +
      '        <span class="affapp-chip">' + (state.streak ? state.streak.streak : 0) + ' days</span>' +
      '      </div>' +
      '    </div>' +
      '  </aside>' +
      '</section>' +
      '<section class="affapp-section">' +
      '  <h2>Recent notes</h2>' +
      renderRecentSessions(state.sessions, active) +
      '</section>';

    var practiceList = mainEl.querySelectorAll('[data-action="affapp-select-affirmation"]');
    practiceList.forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-id');
        if (AFF.actions && typeof AFF.actions.setPracticeSelection === 'function') {
          AFF.actions.setPracticeSelection(id);
        }
      });
    });

    var modeButtons = mainEl.querySelectorAll('[data-action="affapp-select-mode"]');
    modeButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-value');
        if (AFF.actions && typeof AFF.actions.setPracticeMode === 'function') {
          AFF.actions.setPracticeMode(value);
        }
      });
    });

    var form = document.getElementById('affapp-practice-form');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!selected) {
          toast('Create an active affirmation first.');
          return;
        }
        var formData = new window.FormData(form);
        var payload = {
          affirmation_id: selected.id,
          practiced_at: new Date().toISOString().slice(0, 10),
          mode: state.practiceMode || state.settings.default_mode || 'read',
          mood_before: formData.get('mood_before') ? Number(formData.get('mood_before')) : null,
          mood_after: formData.get('mood_after') ? Number(formData.get('mood_after')) : null,
          notes: String(formData.get('notes') || '').trim()
        };
        if (AFF.actions && typeof AFF.actions.logSession === 'function') {
          AFF.actions.logSession(payload);
        }
        form.reset();
      });
    }

    var ttsButtons = mainEl.querySelectorAll('[data-action="affapp-tts"]');
    ttsButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        var text = '';
        if (id && window.AFF && window.AFF.state) {
          var found = (window.AFF.state.affirmations || []).find(function (item) { return item.id === id; });
          if (found) {
            text = found.text || '';
          }
        }
        if (!text) {
          var article = btn.closest('article');
          var paragraph = article ? article.querySelector('p') : null;
          text = paragraph ? paragraph.textContent : '';
        }
        if (AFF.actions && typeof AFF.actions.playTextToSpeech === 'function') {
          AFF.actions.playTextToSpeech(text || (selected ? selected.text : ''));
        }
      });
    });
  }

  function renderHistory(state) {
    var today = new Date();
    var month = state.historyMonth || (today.getUTCMonth() + 1);
    var year = state.historyYear || today.getUTCFullYear();
    var sessions = state.sessions || [];
    var monthSessions = sessions.filter(function (session) {
      var date = new Date(session.practiced_at + 'T00:00:00Z');
      return date.getUTCFullYear() === year && (date.getUTCMonth() + 1) === month;
    });

    mainEl.innerHTML = '' +
      '<section class="affapp-section affapp-columns">' +
      '  <div>' +
      '    <h1>History</h1>' +
      '    <p class="affapp-subtle">Spot streaks and refine statements as you grow.</p>' +
      '    <div class="affapp-card">' +
      '      <header class="affapp-inline" style="justify-content: space-between;">' +
      '        <div>' +
      '          <h2>' + monthName(month) + ' ' + year + '</h2>' +
      '          <p class="affapp-subtle">' + monthSessions.length + ' practice entries this month</p>' +
      '        </div>' +
      '        <div class="affapp-inline">' +
      '          <button type="button" class="affapp-secondary" data-action="affapp-prev-month" aria-label="Previous month">◀</button>' +
      '          <button type="button" class="affapp-secondary" data-action="affapp-next-month" aria-label="Next month">▶</button>' +
      '        </div>' +
      '      </header>' +
      renderHeatmap(year, month, monthSessions) +
      '    </div>' +
      '  </div>' +
      '  <aside>' +
      '    <div class="affapp-card">' +
      '      <h2>Edit affirmations</h2>' +
      renderAffirmationEditor(state.affirmations) +
      '    </div>' +
      '  </aside>' +
      '</section>' +
      '<section class="affapp-section">' +
      '  <h2>Recent sessions</h2>' +
      renderRecentSessions(state.sessions.slice(0, 12), state.affirmations) +
      '</section>';

    var prev = mainEl.querySelector('[data-action="affapp-prev-month"]');
    if (prev) {
      prev.addEventListener('click', function () {
        if (AFF.actions && typeof AFF.actions.shiftHistoryMonth === 'function') {
          AFF.actions.shiftHistoryMonth(-1);
        }
      });
    }
    var next = mainEl.querySelector('[data-action="affapp-next-month"]');
    if (next) {
      next.addEventListener('click', function () {
        if (AFF.actions && typeof AFF.actions.shiftHistoryMonth === 'function') {
          AFF.actions.shiftHistoryMonth(1);
        }
      });
    }

    var editForms = mainEl.querySelectorAll('[data-role="affapp-edit-form"]');
    editForms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var id = form.getAttribute('data-id');
        var text = String(new window.FormData(form).get('text') || '').trim();
        if (id && text && AFF.actions && typeof AFF.actions.updateAffirmation === 'function') {
          AFF.actions.updateAffirmation(id, { text: text });
        }
      });
    });

    var toggleButtons = mainEl.querySelectorAll('[data-action="affapp-toggle-affirmation"]');
    toggleButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-id');
        var active = button.getAttribute('data-active') === 'true';
        if (AFF.actions && typeof AFF.actions.toggleAffirmation === 'function') {
          AFF.actions.toggleAffirmation(id, !active);
        }
      });
    });
  }

  function renderSettings(state) {
    var settings = state.settings || { reminder_time: '07:30', reminder_days: [1, 2, 3, 4, 5], default_mode: 'read', audio_speed: 1 };
    var queue = state.queueStatus || { pending: 0 };
    var isSignedIn = Boolean(state.user);

    mainEl.innerHTML = '' +
      '<section class="affapp-section affapp-columns">' +
      '  <div>' +
      '    <h1>Settings</h1>' +
      '    <p class="affapp-subtle">Tune reminders, modes, and sync preferences.</p>' +
      '    <form id="affapp-settings-form" class="affapp-fieldset" novalidate>' +
      '      <label class="affapp-field">' +
      '        <span class="affapp-label">Reminder time</span>' +
      '        <input class="affapp-input" type="time" name="reminder_time" value="' + escapeHtml(settings.reminder_time || '07:30') + '">' +
      '      </label>' +
      '      <div class="affapp-field">' +
      '        <span class="affapp-label">Reminder days</span>' +
      '        <div class="affapp-checkbox-group">' + renderReminderDays(settings.reminder_days || []) + '</div>' +
      '      </div>' +
      '      <label class="affapp-field">' +
      '        <span class="affapp-label">Default mode</span>' +
      '        <select class="affapp-select" name="default_mode">' + renderModeSelect(settings.default_mode || 'read') + '</select>' +
      '      </label>' +
      '      <label class="affapp-field">' +
      '        <span class="affapp-label">Audio speed</span>' +
      '        <input class="affapp-input" type="number" step="0.1" min="0.5" max="2" name="audio_speed" value="' + escapeHtml(String(settings.audio_speed || 1)) + '">' +
      '      </label>' +
      '      <button type="submit" class="affapp-primary">Save settings</button>' +
      '    </form>' +
      '  </div>' +
      '  <aside>' +
      '    <div class="affapp-card">' +
      '      <h2>Account</h2>' +
      '      <p class="affapp-subtle">' + (isSignedIn ? 'Signed in as ' + escapeHtml(state.user.email || 'member') : 'You are using guest mode. Sign in to sync across devices.') + '</p>' +
      '      <div class="affapp-inline">' +
      (isSignedIn
        ? '<button type="button" class="affapp-secondary" data-action="affapp-sign-out">Sign out</button>'
        : '<button type="button" class="affapp-secondary" data-action="affapp-sign-in">Email magic link</button>') +
      '      </div>' +
      '    </div>' +
      '    <div class="affapp-card">' +
      '      <h2>Install</h2>' +
      '      <p class="affapp-subtle">Keep the practice close. Install it as a standalone experience.</p>' +
      '      <button type="button" class="affapp-secondary" data-action="affapp-install" ' + (installAvailable ? '' : 'disabled') + '>Install app</button>' +
      '    </div>' +
      '    <div class="affapp-card">' +
      '      <h2>Sync status</h2>' +
      '      <p class="affapp-subtle">' + queue.pending + ' actions waiting for connection.</p>' +
      '      <button type="button" class="affapp-secondary" data-action="affapp-sync-now">Sync now</button>' +
      '    </div>' +
      '    <div class="affapp-card">' +
      '      <h2>Accessibility</h2>' +
      '      <button type="button" class="affapp-secondary" data-action="affapp-toggle-contrast">' + (state.highContrast ? 'Disable high contrast' : 'Enable high contrast') + '</button>' +
      '    </div>' +
      '  </aside>' +
      '</section>';

    var settingsForm = document.getElementById('affapp-settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var formData = new window.FormData(settingsForm);
        var reminderDays = [];
        settingsForm.querySelectorAll('input[name="reminder_days"]:checked').forEach(function (checkbox) {
          reminderDays.push(Number(checkbox.value));
        });
        var payload = {
          reminder_time: formData.get('reminder_time') || '07:30',
          reminder_days: reminderDays,
          default_mode: formData.get('default_mode') || 'read',
          audio_speed: Number(formData.get('audio_speed') || 1)
        };
        if (AFF.actions && typeof AFF.actions.saveSettings === 'function') {
          AFF.actions.saveSettings(payload);
        }
      });
    }

    var signInBtn = mainEl.querySelector('[data-action="affapp-sign-in"]');
    if (signInBtn) {
      signInBtn.addEventListener('click', function () {
        var email = window.prompt('Enter your email for a magic link');
        if (email && AFF.actions && typeof AFF.actions.requestMagicLink === 'function') {
          AFF.actions.requestMagicLink(email);
        }
      });
    }

    var signOutBtn = mainEl.querySelector('[data-action="affapp-sign-out"]');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', function () {
        if (AFF.actions && typeof AFF.actions.signOut === 'function') {
          AFF.actions.signOut();
        }
      });
    }

    var syncNowBtn = mainEl.querySelector('[data-action="affapp-sync-now"]');
    if (syncNowBtn) {
      syncNowBtn.addEventListener('click', function () {
        if (AFF.actions && typeof AFF.actions.syncNow === 'function') {
          AFF.actions.syncNow();
        }
      });
    }

    var contrastBtn = mainEl.querySelector('[data-action="affapp-toggle-contrast"]');
    if (contrastBtn) {
      contrastBtn.addEventListener('click', function () {
        if (AFF.actions && typeof AFF.actions.toggleContrast === 'function') {
          AFF.actions.toggleContrast();
        }
      });
    }
  }

  function setStatus(message) {
    if (statusEl) {
      statusEl.textContent = message || '';
    }
  }

  function updateAuthBadge(message, variant) {
    if (authEl) {
      authEl.textContent = message;
      authEl.setAttribute('data-variant', variant || 'info');
    }
  }

  function updateSyncStatus(message) {
    if (syncEl) {
      syncEl.textContent = message;
    }
  }

  function highlightRoute(route) {
    if (!navTabs) {
      return;
    }
    navTabs.forEach(function (tab) {
      if (tab.getAttribute('data-route') === route) {
        tab.classList.add('is-active');
      } else {
        tab.classList.remove('is-active');
      }
    });
  }

  function toast(message) {
    if (!message) {
      return;
    }
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'affapp-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.remove('affapp-hidden');
    window.clearTimeout(toastEl._hideTimer);
    toastEl._hideTimer = window.setTimeout(function () {
      toastEl.classList.add('affapp-hidden');
    }, 4000);
  }

  function setInstallAvailable(value) {
    installAvailable = Boolean(value);
    if (mainEl) {
      var installButton = mainEl.querySelector('[data-action="affapp-install"]');
      if (installButton) {
        installButton.disabled = !installAvailable;
      }
    }
  }

  function renderCategoryPills(templates, selected) {
    return Object.keys(templates).map(function (key) {
      var item = templates[key];
      return '<button type="button" class="affapp-pill" data-active="' + (key === selected) + '" data-value="' + key + '">' +
        '<strong>' + escapeHtml(capitalize(key)) + '</strong><br><span class="affapp-muted" style="font-size:0.8rem;">' + escapeHtml(item.title) + '</span>' +
        '</button>';
    }).join('');
  }

  function buildPreviewText(category, draft, templates) {
    var template = templates[category];
    if (draft && draft.text) {
      return draft.text;
    }
    if (!template) {
      return 'I am present, intentional, and aligned with my goals.';
    }
    return template.template
      .replace('{action}', 'celebrate intentional choices')
      .replace('{outcome}', 'fund future adventures')
      .replace('{habit}', 'move my body with joy')
      .replace('{feeling}', 'vibrant and steady')
      .replace('{strength}', 'clarity and courage')
      .replace('{impact}', 'lasting impact for the people I serve')
      .replace('{quality}', 'compassion')
      .replace('{result}', 'valued and energized')
      .replace('{identity}', 'a grounded creator');
  }

  function renderAffirmationList(affirmations) {
    if (!affirmations.length) {
      return '<div class="affapp-empty">No affirmations yet. Create your first one to unlock practice mode.</div>';
    }
    return '<div class="affapp-card-list">' + affirmations.map(function (item) {
      return '<article class="affapp-card" data-active="' + (item.is_active !== false) + '">' +
        '<header class="affapp-inline" style="justify-content: space-between; align-items: flex-start;">' +
        '  <div>' +
        '    <h3>' + escapeHtml(item.title || 'Untitled affirmation') + '</h3>' +
        '    <span class="affapp-tag">' + escapeHtml(capitalize(item.category || 'custom')) + '</span>' +
        '  </div>' +
        '  <button type="button" class="affapp-secondary" data-action="affapp-toggle-affirmation" data-id="' + item.id + '" data-active="' + (item.is_active !== false) + '">' + (item.is_active !== false ? 'Active' : 'Activate') + '</button>' +
        '</header>' +
        '<p>' + escapeHtml(item.text || '') + '</p>' +
        '</article>';
    }).join('') + '</div>';
  }

  function renderPracticeAffirmations(active, selected) {
    if (!active.length) {
      return '<div class="affapp-empty">No active affirmations. Activate one from the Create tab.</div>';
    }
    return '<div class="affapp-card-list">' + active.map(function (item) {
      var isSelected = selected && item.id === selected.id;
      return '<article class="affapp-card" data-active="' + isSelected + '">' +
        '<header class="affapp-inline" style="justify-content: space-between;">' +
        '  <div>' +
        '    <h2>' + escapeHtml(item.title || 'Affirmation') + '</h2>' +
        '    <span class="affapp-tag">' + escapeHtml(capitalize(item.category || 'custom')) + '</span>' +
        '  </div>' +
        '  <button type="button" class="affapp-secondary" data-action="affapp-select-affirmation" data-id="' + item.id + '">' + (isSelected ? 'Selected' : 'Practice') + '</button>' +
        '</header>' +
        '<p>' + escapeHtml(item.text || '') + '</p>' +
        '<div class="affapp-inline">' +
        '  <button type="button" class="affapp-tertiary" data-action="affapp-tts" data-id="' + item.id + '">Listen</button>' +
        '</div>' +
        '</article>';
    }).join('') + '</div>';
  }

  function renderModeOptions(active) {
    var modes = [
      { value: 'read', label: 'Read', description: 'Slowly read the words aloud to anchor the language.' },
      { value: 'speak', label: 'Speak', description: 'Voice it with conviction. Record yourself for accountability.' },
      { value: 'listen', label: 'Listen', description: 'Use the built-in voice to hear the affirmation spoken back.' },
      { value: 'mirror', label: 'Mirror', description: 'Stand tall, meet your eyes in the mirror, and speak deliberately.' },
      { value: 'visualize', label: 'Visualize', description: 'Picture the moment the statement becomes reality.' },
      { value: 'journal', label: 'Journal', description: 'Write a few lines about evidence that it is already true.' }
    ];
    return modes.map(function (mode) {
      return '<button type="button" class="affapp-mode" data-action="affapp-select-mode" data-value="' + mode.value + '" data-active="' + (mode.value === active) + '">' +
        '<strong>' + escapeHtml(mode.label) + '</strong>' +
        '<span class="affapp-subtle">' + escapeHtml(mode.description) + '</span>' +
        '</button>';
    }).join('');
  }

  function renderMoodOptions() {
    var options = ['--', '1', '2', '3', '4', '5'];
    return options.map(function (value) {
      if (value === '--') {
        return '<option value="">--</option>';
      }
      return '<option value="' + value + '">' + value + '</option>';
    }).join('');
  }

  function renderRecentSessions(sessions, affirmations) {
    if (!sessions || !sessions.length) {
      return '<div class="affapp-empty">No sessions logged yet. Your history will appear here.</div>';
    }
    var byId = {};
    (affirmations || []).forEach(function (item) { byId[item.id] = item; });
    return '<ul class="affapp-list">' + sessions.map(function (session) {
      var aff = byId[session.affirmation_id];
      return '<li class="affapp-list-item">' +
        '<div class="affapp-inline" style="justify-content: space-between;">' +
        '  <strong>' + escapeHtml(aff ? aff.title : 'Affirmation') + '</strong>' +
        '  <span class="affapp-muted">' + formatDate(session.practiced_at) + ' · ' + escapeHtml(capitalize(session.mode || 'read')) + '</span>' +
        '</div>' +
        (session.notes ? '<p>' + escapeHtml(session.notes) + '</p>' : '') +
        '</li>';
    }).join('') + '</ul>';
  }

  function renderHeatmap(year, month, sessions) {
    var daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    var counts = {};
    sessions.forEach(function (session) {
      counts[session.practiced_at] = (counts[session.practiced_at] || 0) + 1;
    });
    var firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    var cells = [];
    for (var i = 0; i < firstDay; i += 1) {
      cells.push('<div class="affapp-heatmap-cell" data-count="0" aria-hidden="true"></div>');
    }
    for (var day = 1; day <= daysInMonth; day += 1) {
      var key = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      var count = counts[key] || 0;
      cells.push('<div class="affapp-heatmap-cell" data-count="' + count + '" aria-label="' + count + ' sessions on ' + formatDate(key) + '">' + day + '</div>');
    }
    return '<div class="affapp-heatmap" role="grid" aria-readonly="true">' + cells.join('') + '</div>';
  }

  function renderAffirmationEditor(list) {
    if (!list.length) {
      return '<div class="affapp-empty">Add an affirmation to edit the copy here.</div>';
    }
    return '<div class="affapp-card-list">' + list.map(function (item) {
      return '<form class="affapp-card" data-role="affapp-edit-form" data-id="' + item.id + '">' +
        '<label class="affapp-field">' +
        '  <span class="affapp-label">' + escapeHtml(item.title || 'Affirmation') + '</span>' +
        '  <textarea class="affapp-textarea" name="text">' + escapeHtml(item.text || '') + '</textarea>' +
        '</label>' +
        '<div class="affapp-inline" style="justify-content: space-between;">' +
        '  <button type="submit" class="affapp-primary">Save copy</button>' +
        '  <button type="button" class="affapp-secondary" data-action="affapp-toggle-affirmation" data-id="' + item.id + '" data-active="' + (item.is_active !== false) + '">' + (item.is_active !== false ? 'Disable' : 'Enable') + '</button>' +
        '</div>' +
        '</form>';
    }).join('') + '</div>';
  }

  function renderReminderDays(selected) {
    var days = [
      { value: 1, label: 'Mon' },
      { value: 2, label: 'Tue' },
      { value: 3, label: 'Wed' },
      { value: 4, label: 'Thu' },
      { value: 5, label: 'Fri' },
      { value: 6, label: 'Sat' },
      { value: 0, label: 'Sun' }
    ];
    return days.map(function (day) {
      return '<label class="affapp-checkbox">' +
        '<input type="checkbox" name="reminder_days" value="' + day.value + '" ' + (selected.indexOf(day.value) !== -1 ? 'checked' : '') + '>' +
        '<span>' + day.label + '</span>' +
        '</label>';
    }).join('');
  }

  function renderModeSelect(value) {
    var modes = ['read', 'speak', 'listen', 'mirror', 'visualize', 'journal'];
    return modes.map(function (mode) {
      return '<option value="' + mode + '" ' + (mode === value ? 'selected' : '') + '>' + capitalize(mode) + '</option>';
    }).join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (match) {
      var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return map[match];
    });
  }

  function capitalize(value) {
    value = String(value || '');
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function formatDate(value) {
    if (!value) {
      return '';
    }
    var date = new Date(value + 'T00:00:00Z');
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function formatRelative(value) {
    if (!value) {
      return '';
    }
    var now = new Date();
    var then = new Date(value + 'T00:00:00Z');
    var diff = Math.round((now - then) / (1000 * 60 * 60 * 24));
    if (diff === 0) {
      return 'today';
    }
    if (diff === 1) {
      return 'yesterday';
    }
    return diff + ' days ago';
  }

  function monthName(month) {
    return new Date(Date.UTC(2024, month - 1, 1)).toLocaleString(undefined, { month: 'long' });
  }

  function setInstallAvailableInDOM() {
    if (!mainEl) {
      return;
    }
    var installButton = mainEl.querySelector('[data-action="affapp-install"]');
    if (installButton) {
      installButton.disabled = !installAvailable;
    }
  }

  function handleDraftChange(event) {
    if (AFF.actions && typeof AFF.actions.updateDraft === 'function') {
      var target = event.target;
      var name = target.name;
      var value = target.value;
      AFF.actions.updateDraft(name, value);
    }
    if (event.target.form) {
      var formData = new window.FormData(event.target.form);
      var draft = {
        title: String(formData.get('title') || ''),
        text: String(formData.get('text') || '')
      };
      var preview = document.getElementById('affapp-live-preview');
      if (preview) {
        preview.textContent = draft.text || buildPreviewText('custom', draft, AFF.templates ? AFF.templates.getAll() : {});
      }
    }
  }

  function showConfetti() {
    var container = document.createElement('div');
    container.className = 'affapp-confetti';
    document.body.appendChild(container);
    var count = 30;
    for (var i = 0; i < count; i += 1) {
      var piece = document.createElement('div');
      piece.className = 'affapp-confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.animationDuration = 2 + Math.random() * 1 + 's';
      container.appendChild(piece);
    }
    window.setTimeout(function () {
      container.remove();
    }, 3200);
  }

  setInterval(setInstallAvailableInDOM, 1000);
})();
