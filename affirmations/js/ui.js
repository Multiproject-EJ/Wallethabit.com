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

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        var openPanel = document.querySelector('.affapp-overlay.is-open');
        if (openPanel) {
          closePanel(openPanel.getAttribute('data-panel'));
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

  function openPanel(name) {
    if (!name) {
      return;
    }
    var panel = document.querySelector('.affapp-overlay[data-panel="' + name + '"]');
    if (!panel) {
      return;
    }
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    var focusTarget = panel.querySelector('[data-autofocus]') || panel.querySelector('input, textarea, select, button');
    if (focusTarget && typeof focusTarget.focus === 'function') {
      window.requestAnimationFrame(function () {
        focusTarget.focus();
      });
    }
  }

  function closePanel(name) {
    if (!name) {
      return;
    }
    var panel = document.querySelector('.affapp-overlay[data-panel="' + name + '"]');
    if (!panel) {
      return;
    }
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
  }

  function bindPanels(root) {
    if (!root) {
      return;
    }
    var overlays = root.querySelectorAll('.affapp-overlay');
    overlays.forEach(function (panel) {
      if (!panel.hasAttribute('aria-hidden')) {
        panel.setAttribute('aria-hidden', 'true');
      }
      panel.addEventListener('click', function (event) {
        if (event.target === panel) {
          closePanel(panel.getAttribute('data-panel'));
        }
      });
    });
    root.querySelectorAll('[data-panel-open]').forEach(function (button) {
      button.addEventListener('click', function () {
        openPanel(button.getAttribute('data-panel-open'));
      });
    });
    root.querySelectorAll('[data-panel-close]').forEach(function (button) {
      button.addEventListener('click', function () {
        closePanel(button.getAttribute('data-panel-close'));
      });
    });
  }

  function renderCreate(state) {
    var templates = AFF.templates ? AFF.templates.getAll() : {};
    var why = AFF.templates ? AFF.templates.getWhy() : [];
    var selected = state.createCategory || 'finance';
    var preview = state.createPreview || buildPreviewText(selected, state.createDraft || {}, templates);
    var draft = state.createDraft || { title: '', text: '' };
    var activeList = state.affirmations.filter(function (item) { return item.is_active !== false; });
    var latest = activeList[0];

    mainEl.innerHTML = '' +
      '<section class="affapp-stage">' +
      '  <article class="affapp-stage-card">' +
      '    <header>' +
      '      <div>' +
      '        <span class="affapp-chip">' + activeList.length + ' active</span>' +
      '        <h1>Design your next affirmation</h1>' +
      '      </div>' +
      '      <span class="affapp-subtle">Focus · ' + escapeHtml(capitalize(selected)) + '</span>' +
      '    </header>' +
      '    <p>Keep the canvas calm. Open only what you need as you move from inspiration to copy.</p>' +
      '    <div class="affapp-preview" id="affapp-live-preview">' + escapeHtml(preview || '') + '</div>' +
      (latest ? '    <span class="affapp-subtle">Last saved · ' + escapeHtml(latest.title || 'Affirmation') + '</span>' : '') +
      '    <div class="affapp-stage-actions">' +
      '      <button type="button" class="affapp-primary" data-panel-open="compose">Compose affirmation</button>' +
      '      <button type="button" class="affapp-secondary" data-panel-open="focus">Switch focus</button>' +
      '      <button type="button" class="affapp-secondary" data-panel-open="library">Saved library</button>' +
      '      <button type="button" class="affapp-tertiary" data-panel-open="why">Why this works</button>' +
      '    </div>' +
      '  </article>' +
      '  <aside class="affapp-stage-meta">' +
      '    <div class="affapp-stage-panel">' +
      '      <h2>Today</h2>' +
      '      <div class="affapp-stage-stat"><span class="affapp-stat-value">' + activeList.length + '</span><span class="affapp-stat-label">Active now</span></div>' +
      '      <div class="affapp-stage-stat"><span class="affapp-stat-value">' + state.affirmations.length + '</span><span class="affapp-stat-label">Saved total</span></div>' +
      '      <button type="button" class="affapp-secondary" data-panel-open="library">Manage library</button>' +
      '    </div>' +
      '  </aside>' +
      '</section>' +
      '<div class="affapp-overlay" data-panel="compose" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-compose-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-compose-title">Compose affirmation</h2>' +
           renderCloseButton('compose') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
      '      <form id="affapp-create-form" class="affapp-fieldset" novalidate>' +
      '        <label class="affapp-field">' +
      '          <span class="affapp-label">Affirmation title</span>' +
      '          <input class="affapp-input" name="title" value="' + escapeHtml(draft.title || '') + '" required maxlength="80" placeholder="Money wins today" data-autofocus>' +
      '        </label>' +
      '        <label class="affapp-field">' +
      '          <span class="affapp-label">Affirmation text</span>' +
      '          <textarea class="affapp-textarea" name="text" required maxlength="250" placeholder="I celebrate how I..."></textarea>' +
      '        </label>' +
      '        <div class="affapp-inline">' +
      '          <button type="submit" class="affapp-primary">Save affirmation</button>' +
      '          <button type="button" class="affapp-secondary" data-action="affapp-use-template">Use template</button>' +
      '        </div>' +
      '      </form>' +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="affapp-overlay" data-panel="focus" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-focus-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-focus-title">Choose a focus</h2>' +
           renderCloseButton('focus') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
      '      <p class="affapp-subtle">Pick the area you want to nourish today. The preview updates instantly.</p>' +
      '      <div class="affapp-pill-group" role="radiogroup">' + renderCategoryPills(templates, selected) + '</div>' +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="affapp-overlay" data-panel="library" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-library-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-library-title">Affirmation library</h2>' +
           renderCloseButton('library') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
             renderAffirmationList(state.affirmations, { collapsible: true, expandFirst: true }) +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="affapp-overlay" data-panel="why" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-why-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-why-title">Why this works</h2>' +
           renderCloseButton('why') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
      '      <ul class="affapp-list" id="affapp-why">' + why.map(function (line) { return '<li class="affapp-list-item">' + escapeHtml(line) + '</li>'; }).join('') + '</ul>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    bindPanels(mainEl);

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
    var streakLabel = state.streak && state.streak.lastPracticeDate ? 'Last practice ' + formatRelative(state.streak.lastPracticeDate) : 'No sessions logged yet.';
    var heroSummary = selected ? 'Stay with this language for today or choose another focus.' : 'Activate an affirmation to begin a session.';
    var streakCount = state.streak ? state.streak.streak : 0;

    mainEl.innerHTML = '' +
      '<section class="affapp-stage">' +
      '  <article class="affapp-stage-card">' +
      '    <header>' +
      '      <div>' +
      '        <span class="affapp-chip">Mode · ' + escapeHtml(capitalize(mode)) + '</span>' +
      '        <h1>' + (selected ? escapeHtml(selected.title || 'Affirmation') : 'No active affirmation') + '</h1>' +
      '      </div>' +
      (selected ? '      <button type="button" class="affapp-tertiary" data-action="affapp-tts" data-id="' + selected.id + '">Listen</button>' : '') +
      '    </header>' +
      '    <p>' + escapeHtml(heroSummary) + '</p>' +
      (selected ? '    <div class="affapp-preview">' + escapeHtml(selected.text || '') + '</div>' : '') +
      '    <div class="affapp-stage-actions">' +
      (selected
        ? '      <button type="button" class="affapp-primary" data-panel-open="practice-log">Log session</button>'
        : '      <button type="button" class="affapp-primary" data-panel-open="practice-choose">Activate affirmation</button>') +
      '      <button type="button" class="affapp-secondary" data-panel-open="practice-choose">Switch affirmation</button>' +
      '      <button type="button" class="affapp-secondary" data-panel-open="practice-mode">Change mode</button>' +
      '      <button type="button" class="affapp-tertiary" data-panel-open="practice-notes">Recent notes</button>' +
      '    </div>' +
      '  </article>' +
      '  <aside class="affapp-stage-meta">' +
      '    <div class="affapp-stage-panel">' +
      '      <h2>Progress</h2>' +
      '      <div class="affapp-stage-stat"><span class="affapp-stat-value">' + streakCount + '</span><span class="affapp-stat-label">Day streak</span></div>' +
      '      <p class="affapp-subtle">' + escapeHtml(streakLabel) + '</p>' +
      '      <button type="button" class="affapp-secondary" data-panel-open="practice-notes">View log</button>' +
      '    </div>' +
      '  </aside>' +
      '</section>' +
      '<div class="affapp-overlay" data-panel="practice-log" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-log-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-log-title">Log today</h2>' +
           renderCloseButton('practice-log') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
      '      <form id="affapp-practice-form" class="affapp-fieldset">' +
      '        <label class="affapp-field">' +
      '          <span class="affapp-label">Mood before</span>' +
      '          <select class="affapp-select" name="mood_before" data-autofocus>' + renderMoodOptions() + '</select>' +
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
      '  </div>' +
      '</div>' +
      '<div class="affapp-overlay" data-panel="practice-choose" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-choose-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-choose-title">Active affirmations</h2>' +
           renderCloseButton('practice-choose') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
             renderPracticeAffirmations(active, selected, { expandFirst: true }) +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="affapp-overlay" data-panel="practice-mode" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-mode-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-mode-title">Practice modes</h2>' +
           renderCloseButton('practice-mode') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
      '      <div class="affapp-mode-grid" role="radiogroup">' + renderModeOptions(mode) + '</div>' +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="affapp-overlay" data-panel="practice-notes" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-notes-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-notes-title">Recent sessions</h2>' +
           renderCloseButton('practice-notes') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
             renderRecentSessions(state.sessions.slice(0, 12), active) +
      '    </div>' +
      '  </div>' +
      '</div>';

    bindPanels(mainEl);

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
      '<section class="affapp-stage">' +
      '  <article class="affapp-stage-card">' +
      '    <header>' +
      '      <div>' +
      '        <span class="affapp-chip">' + monthName(month) + ' ' + year + '</span>' +
      '        <h1>Track your rhythm</h1>' +
      '      </div>' +
      '      <span class="affapp-subtle">' + monthSessions.length + ' sessions</span>' +
      '    </header>' +
      '    <p>Open the calendar or log when you want detail. Otherwise, stay present with today.</p>' +
      '    <div class="affapp-stage-actions">' +
      '      <button type="button" class="affapp-primary" data-panel-open="history-calendar">View calendar</button>' +
      '      <button type="button" class="affapp-secondary" data-panel-open="history-edit">Edit affirmations</button>' +
      '      <button type="button" class="affapp-tertiary" data-panel-open="history-sessions">Session notes</button>' +
      '    </div>' +
      '  </article>' +
      '  <aside class="affapp-stage-meta">' +
      '    <div class="affapp-stage-panel">' +
      '      <h2>Highlights</h2>' +
      '      <div class="affapp-stage-stat"><span class="affapp-stat-value">' + state.affirmations.length + '</span><span class="affapp-stat-label">Affirmations saved</span></div>' +
      '      <div class="affapp-stage-stat"><span class="affapp-stat-value">' + state.affirmations.filter(function (item) { return item.is_active !== false; }).length + '</span><span class="affapp-stat-label">Active now</span></div>' +
      '      <button type="button" class="affapp-secondary" data-panel-open="history-calendar">Open calendar</button>' +
      '    </div>' +
      '  </aside>' +
      '</section>' +
      '<div class="affapp-overlay" data-panel="history-calendar" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-calendar-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-calendar-title">Monthly calendar</h2>' +
           renderCloseButton('history-calendar') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
      '      <div class="affapp-inline" style="justify-content: space-between;">' +
      '        <button type="button" class="affapp-secondary" data-action="affapp-prev-month">Previous</button>' +
      '        <button type="button" class="affapp-secondary" data-action="affapp-next-month">Next</button>' +
      '      </div>' +
      '      <div class="affapp-hero-calendar">' + renderHeatmap(year, month, monthSessions) + '</div>' +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="affapp-overlay" data-panel="history-edit" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-edit-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-edit-title">Edit affirmations</h2>' +
           renderCloseButton('history-edit') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
             renderAffirmationEditor(state.affirmations) +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="affapp-overlay" data-panel="history-sessions" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-sessions-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-sessions-title">Recent sessions</h2>' +
           renderCloseButton('history-sessions') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
             renderRecentSessions(state.sessions.slice(0, 12), state.affirmations) +
      '    </div>' +
      '  </div>' +
      '</div>';

    bindPanels(mainEl);

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
        var textValue = String(new window.FormData(form).get('text') || '').trim();
        if (id && textValue && AFF.actions && typeof AFF.actions.updateAffirmation === 'function') {
          AFF.actions.updateAffirmation(id, { text: textValue });
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
    var reminderTime = settings.reminder_time || '07:30';

    mainEl.innerHTML = '' +
      '<section class="affapp-stage">' +
      '  <article class="affapp-stage-card">' +
      '    <header>' +
      '      <div>' +
      '        <span class="affapp-chip">Settings</span>' +
      '        <h1>Make it feel like yours</h1>' +
      '      </div>' +
      '      <span class="affapp-subtle">' + (queue.pending ? queue.pending + ' actions to sync' : 'All changes synced') + '</span>' +
      '    </header>' +
      '    <p>' + (isSignedIn ? 'Signed in as ' + escapeHtml(state.user.email || 'member') + '.' : 'You are in guest mode. Sign in to keep progress everywhere.') + '</p>' +
      '    <div class="affapp-stage-actions">' +
      '      <button type="button" class="affapp-primary" data-panel-open="settings-preferences">Adjust reminders</button>' +
      '      <button type="button" class="affapp-secondary" data-panel-open="settings-account">Account</button>' +
      '      <button type="button" class="affapp-tertiary" data-panel-open="settings-device">Device tools</button>' +
      '    </div>' +
      '  </article>' +
      '  <aside class="affapp-stage-meta">' +
      '    <div class="affapp-stage-panel">' +
      '      <h2>Snapshot</h2>' +
      '      <div class="affapp-stage-stat"><span class="affapp-stat-value">' + escapeHtml(reminderTime) + '</span><span class="affapp-stat-label">Reminder time</span></div>' +
      '      <div class="affapp-stage-stat"><span class="affapp-stat-value">' + escapeHtml(capitalize(settings.default_mode || 'read')) + '</span><span class="affapp-stat-label">Default mode</span></div>' +
      '      <button type="button" class="affapp-secondary" data-panel-open="settings-preferences">Edit defaults</button>' +
      '    </div>' +
      '  </aside>' +
      '</section>' +
      '<div class="affapp-overlay" data-panel="settings-preferences" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-preferences-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-preferences-title">Daily reminders</h2>' +
           renderCloseButton('settings-preferences') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
      '      <form id="affapp-settings-form" class="affapp-fieldset" novalidate>' +
      '        <label class="affapp-field">' +
      '          <span class="affapp-label">Reminder time</span>' +
      '          <input class="affapp-input" type="time" name="reminder_time" value="' + escapeHtml(reminderTime) + '" data-autofocus>' +
      '        </label>' +
      '        <div class="affapp-field">' +
      '          <span class="affapp-label">Reminder days</span>' +
      '          <div class="affapp-checkbox-group">' + renderReminderDays(settings.reminder_days || []) + '</div>' +
      '        </div>' +
      '        <label class="affapp-field">' +
      '          <span class="affapp-label">Default mode</span>' +
      '          <select class="affapp-select" name="default_mode">' + renderModeSelect(settings.default_mode || 'read') + '</select>' +
      '        </label>' +
      '        <label class="affapp-field">' +
      '          <span class="affapp-label">Audio speed</span>' +
      '          <input class="affapp-input" type="number" step="0.1" min="0.5" max="2" name="audio_speed" value="' + escapeHtml(String(settings.audio_speed || 1)) + '">' +
      '        </label>' +
      '        <button type="submit" class="affapp-primary">Save settings</button>' +
      '      </form>' +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="affapp-overlay" data-panel="settings-account" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-account-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-account-title">Account</h2>' +
           renderCloseButton('settings-account') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
      '      <p class="affapp-subtle">' + (isSignedIn ? 'Signed in as ' + escapeHtml(state.user.email || 'member') + '.' : 'Use a magic link to sync affirmations across devices.') + '</p>' +
      '      <button type="button" class="affapp-secondary" data-action="' + (isSignedIn ? 'affapp-sign-out' : 'affapp-sign-in') + '">' + (isSignedIn ? 'Sign out' : 'Email magic link') + '</button>' +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="affapp-overlay" data-panel="settings-device" aria-hidden="true">' +
      '  <div class="affapp-drawer" role="dialog" aria-modal="true" aria-labelledby="affapp-device-title">' +
      '    <header class="affapp-drawer-header">' +
      '      <h2 id="affapp-device-title">Device tools</h2>' +
           renderCloseButton('settings-device') +
      '    </header>' +
      '    <div class="affapp-drawer-content">' +
      '      <p class="affapp-subtle">Keep the practice close on this device.</p>' +
      '      <button type="button" class="affapp-secondary" data-action="affapp-install">Install app</button>' +
      '      <button type="button" class="affapp-secondary" data-action="affapp-sync-now">Sync now</button>' +
      '      <button type="button" class="affapp-tertiary" data-action="affapp-toggle-contrast">' + (state.highContrast ? 'Disable high contrast' : 'Enable high contrast') + '</button>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    bindPanels(mainEl);

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

    var signInButton = mainEl.querySelector('[data-action="affapp-sign-in"]');
    if (signInButton) {
      signInButton.addEventListener('click', function () {
        if (AFF.actions && typeof AFF.actions.signIn === 'function') {
          AFF.actions.signIn();
        }
      });
    }

    var signOutButton = mainEl.querySelector('[data-action="affapp-sign-out"]');
    if (signOutButton) {
      signOutButton.addEventListener('click', function () {
        if (AFF.actions && typeof AFF.actions.signOut === 'function') {
          AFF.actions.signOut();
        }
      });
    }

    var syncButton = mainEl.querySelector('[data-action="affapp-sync-now"]');
    if (syncButton) {
      syncButton.addEventListener('click', function () {
        if (AFF.actions && typeof AFF.actions.syncNow === 'function') {
          AFF.actions.syncNow();
        }
      });
    }

    var contrastButton = mainEl.querySelector('[data-action="affapp-toggle-contrast"]');
    if (contrastButton) {
      contrastButton.addEventListener('click', function () {
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

  function renderCloseButton(panel) {
    return '<button type="button" class="affapp-icon-button" data-panel-close="' + panel + '" aria-label="Close panel">' +
      '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 0 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 0 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 1 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06z"/></svg>' +
      '</button>';
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

  function renderAffirmationList(affirmations, options) {
    options = options || {};
    if (!affirmations.length) {
      return '<div class="affapp-empty">No affirmations yet. Create your first one to unlock practice mode.</div>';
    }
    return '<div class="affapp-card-list">' + affirmations.map(function (item, index) {
      var isActive = item.is_active !== false;
      var detailsOpen = options.expandFirst && index === 0 ? ' open' : '';
      var snippet = buildSnippet(item.text || '');
      var body = options.collapsible === false
        ? '<p>' + escapeHtml(item.text || '') + '</p>'
        : '<details class="affapp-card-collapse"' + detailsOpen + '>' +
          '  <summary><span>' + escapeHtml(snippet) + '</span></summary>' +
          '  <p>' + escapeHtml(item.text || '') + '</p>' +
          '</details>';
      return '<article class="affapp-card" data-active="' + isActive + '">' +
        '<header class="affapp-inline" style="justify-content: space-between; align-items: flex-start;">' +
        '  <div>' +
        '    <h3>' + escapeHtml(item.title || 'Untitled affirmation') + '</h3>' +
        '    <span class="affapp-tag">' + escapeHtml(capitalize(item.category || 'custom')) + '</span>' +
        '  </div>' +
        '  <button type="button" class="affapp-secondary" data-action="affapp-toggle-affirmation" data-id="' + item.id + '" data-active="' + isActive + '">' + (isActive ? 'Active' : 'Activate') + '</button>' +
        '</header>' +
        body +
        '</article>';
    }).join('') + '</div>';
  }

  function renderPracticeAffirmations(active, selected, options) {
    options = options || {};
    if (!active.length) {
      return '<div class="affapp-empty">No active affirmations. Activate one from the Create tab.</div>';
    }
    return '<div class="affapp-card-list">' + active.map(function (item, index) {
      var isSelected = selected && item.id === selected.id;
      var detailsOpen = options.expandFirst && index === 0 ? ' open' : '';
      var snippet = buildSnippet(item.text || '');
      var body = options.collapsible === false
        ? '<p>' + escapeHtml(item.text || '') + '</p>' +
          '<div class="affapp-inline">' +
          '  <button type="button" class="affapp-tertiary" data-action="affapp-tts" data-id="' + item.id + '">Listen</button>' +
          '</div>'
        : '<details class="affapp-card-collapse"' + detailsOpen + '>' +
          '  <summary><span>' + escapeHtml(snippet) + '</span></summary>' +
          '  <p>' + escapeHtml(item.text || '') + '</p>' +
          '  <div class="affapp-inline">' +
          '    <button type="button" class="affapp-tertiary" data-action="affapp-tts" data-id="' + item.id + '">Listen</button>' +
          '  </div>' +
          '</details>';
      return '<article class="affapp-card" data-selected="' + isSelected + '">' +
        '<header class="affapp-inline" style="justify-content: space-between; align-items: flex-start;">' +
        '  <div>' +
        '    <h2>' + escapeHtml(item.title || 'Affirmation') + '</h2>' +
        '    <span class="affapp-tag">' + escapeHtml(capitalize(item.category || 'custom')) + '</span>' +
        '  </div>' +
        '  <button type="button" class="affapp-secondary" data-action="affapp-select-affirmation" data-id="' + item.id + '">' + (isSelected ? 'Selected' : 'Practice') + '</button>' +
        '</header>' +
        body +
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

  function buildSnippet(text) {
    text = String(text || '').trim();
    if (!text) {
      return 'Read affirmation';
    }
    if (text.length > 80) {
      text = text.slice(0, 77).trim();
      if (!/[.!?…]$/.test(text)) {
        text += '…';
      }
    }
    return text;
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
