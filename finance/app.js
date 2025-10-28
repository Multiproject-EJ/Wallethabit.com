(function () {
  'use strict';

  const DEFAULT_CATEGORIES = ['Rent', 'Groceries', 'Eating out', 'Transport', 'Utilities', 'Insurance', 'Health', 'Subscriptions', 'Fun', 'Misc'];
  const ROUTES = ['dashboard', 'transactions', 'budget', 'goals', 'networth', 'investments', 'settings'];
  const CSV_MAP_KEY = 'ff_finance__csvmap_v1';
  const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const ROLLOVER_SETTING_KEY = 'budgetRolloverEnabled';
  const ROLLOVER_LAST_PROCESSED_KEY = 'rolloverLastProcessed';
  const NET_WORTH_HISTORY_MONTHS = 12;
  const NET_WORTH_LAST_SNAPSHOT_KEY = 'nwLastSnapshotMonth';

  const state = {
    route: 'dashboard',
    month: isoMonth(new Date()),
    currency: 'EUR',
    categories: [...DEFAULT_CATEGORIES],
    rolloverEnabled: true,
    formatter: new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' })
  };

  let appEl;
  let mainEl;
  let statusEl;
  const csvElements = {};
  const csvState = {
    rows: [],
    headers: [],
    delimiter: ',',
    records: [],
    skipped: 0
  };
  let csvModalOpen = false;
  let csvPreviousFocus = null;
  let rolloverProcessingPromise = null;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    appEl = document.querySelector('.ffapp');
    mainEl = document.getElementById('ffapp-view');
    statusEl = document.getElementById('ffapp-status');

    setupNav();
    setupQuickAdd();
    setupCSVImport();
    bootstrapSettings().then(() => {
      navigate(state.route);
    });
  }

  function setupNav() {
    const tabs = appEl.querySelectorAll('.ffapp-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const route = tab.dataset.route;
        if (route) {
          navigate(route);
        }
      });
    });
  }

  function setupQuickAdd() {
    const addBtn = document.getElementById('ffapp-add-transaction');
    addBtn.addEventListener('click', () => {
      navigate('transactions');
      window.requestAnimationFrame(() => {
        const form = document.getElementById('ffapp-form-transaction');
        if (form) {
          const payee = form.querySelector('input[name="payee"]');
          if (payee) {
            payee.focus();
          }
        }
      });
    });
  }

  function setupCSVImport() {
    csvElements.button = document.getElementById('ffapp-import-csv');
    csvElements.fileInput = document.getElementById('ffapp-csv-input');
    csvElements.modal = document.getElementById('ffapp-csv-modal');
    csvElements.dialog = csvElements.modal ? csvElements.modal.querySelector('.ffapp-modal-dialog') : null;
    csvElements.form = document.getElementById('ffapp-csv-mapper');
    csvElements.previewBody = csvElements.modal ? csvElements.modal.querySelector('[data-role="csv-preview"]') : null;
    csvElements.message = csvElements.modal ? csvElements.modal.querySelector('[data-role="csv-message"]') : null;
    csvElements.importButton = csvElements.modal ? csvElements.modal.querySelector('[data-action="csv-import"]') : null;
    csvElements.selects = csvElements.form ? Array.from(csvElements.form.querySelectorAll('select[data-map]')) : [];

    if (!csvElements.button || !csvElements.fileInput || !csvElements.modal || !csvElements.dialog || !csvElements.form || !csvElements.previewBody || !csvElements.message || !csvElements.importButton) {
      return;
    }

    csvElements.button.addEventListener('click', () => {
      csvElements.fileInput.value = '';
      csvElements.fileInput.click();
    });

    csvElements.fileInput.addEventListener('change', () => {
      const file = csvElements.fileInput.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = parseCsv(String(reader.result || ''));
          csvState.rows = parsed.rows;
          csvState.headers = parsed.headers;
          csvState.delimiter = parsed.delimiter;
          updateCsvSelectOptions(parsed.headers);
          applySavedCsvMapping(parsed.headers);
          openCsvModal();
          updateCsvPreview();
        } catch (error) {
          openCsvModal();
          updateCsvSelectOptions([]);
          showCsvMessage(`Import failed: ${error.message}`, true);
          csvState.rows = [];
          csvState.headers = [];
          csvState.records = [];
          csvState.skipped = 0;
          clearCsvPreview();
        }
        csvElements.fileInput.value = '';
      };
      reader.onerror = () => {
        openCsvModal();
        updateCsvSelectOptions([]);
        showCsvMessage('Unable to read the selected file.', true);
        csvState.rows = [];
        csvState.headers = [];
        csvState.records = [];
        csvState.skipped = 0;
        clearCsvPreview();
        csvElements.fileInput.value = '';
      };
      reader.readAsText(file);
    });

    csvElements.modal.addEventListener('click', (event) => {
      const target = event.target;
      if (target && target.dataset.action === 'close-modal') {
        event.preventDefault();
        closeCsvModal();
      }
    });

    csvElements.form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const mapping = getCsvMapping();
      if (!isCsvMappingValid(mapping)) {
        updateCsvPreview();
        return;
      }
      const result = transformCsvRows(mapping);
      if (!result.records.length) {
        showCsvMessage('No valid rows to import with the current mapping.', true);
        csvElements.importButton.disabled = true;
        return;
      }
      csvElements.importButton.disabled = true;
      try {
        const payload = result.records.map((record) => ({ ...record, id: uuid() }));
        await FFDB.bulkPut('transactions', payload);
        persistCsvMapping(mapping);
        closeCsvModal();
        await renderTransactionsTable();
        await loadDashboardMetricsSilent();
      } catch (error) {
        showCsvMessage(`Import failed: ${error.message}`, true);
        csvElements.importButton.disabled = false;
      }
    });

    csvElements.selects.forEach((select) => {
      select.addEventListener('change', () => {
        updateCsvPreview();
      });
    });
  }

  async function bootstrapSettings() {
    await FFDB.open();
    const storedCategories = await FFDB.getSetting('categories');
    const storedCurrency = await FFDB.getSetting('currency');
    const storedRollover = await FFDB.getSetting(ROLLOVER_SETTING_KEY);
    if (Array.isArray(storedCategories) && storedCategories.length) {
      state.categories = storedCategories.slice();
    } else {
      await FFDB.setSetting('categories', state.categories);
    }
    if (typeof storedCurrency === 'string') {
      state.currency = storedCurrency;
    } else {
      await FFDB.setSetting('currency', state.currency);
    }
    if (typeof storedRollover === 'boolean') {
      state.rolloverEnabled = storedRollover;
    } else {
      await FFDB.setSetting(ROLLOVER_SETTING_KEY, state.rolloverEnabled);
    }
    refreshFormatter();
    await ensureRolloverProcessing();
    await updateNetWorthStatus();
  }

  function refreshFormatter() {
    state.formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: state.currency });
  }

  function navigate(route) {
    if (!ROUTES.includes(route)) {
      route = 'dashboard';
    }
    state.route = route;
    appEl.dataset.route = route;
    setActiveTabs(route);
    renderRoute(route);
  }

  function setActiveTabs(route) {
    const tabs = appEl.querySelectorAll('.ffapp-tab');
    tabs.forEach((tab) => {
      tab.classList.toggle('is-active', tab.dataset.route === route);
    });
  }

  function renderRoute(route) {
    const template = document.getElementById(`tpl-${route}`);
    if (!template) return;
    mainEl.innerHTML = '';
    const fragment = template.content.cloneNode(true);
    mainEl.appendChild(fragment);
    const loader = routeLoaders[route];
    if (typeof loader === 'function') {
      loader();
    }
  }

  const routeLoaders = {
    dashboard: loadDashboard,
    transactions: loadTransactions,
    budget: loadBudget,
    goals: loadGoals,
    networth: loadNetWorth,
    investments: loadInvestments,
    settings: loadSettings
  };

  async function loadDashboard() {
    const selectMonth = mainEl.querySelector('[data-filter="month"]');
    fillMonthOptions(selectMonth, state.month);
    if (selectMonth && !selectMonth.dataset.bound) {
      selectMonth.addEventListener('change', () => {
        state.month = selectMonth.value;
        loadDashboard();
      });
      selectMonth.dataset.bound = 'true';
    }

    await ensureRolloverProcessing();

    const transactions = await FFDB.getAll('transactions');
    const current = transactions.filter((tx) => isoMonth(tx.date) === state.month);
    const income = sum(current.filter((tx) => tx.type === 'income').map((tx) => Number(tx.amount) || 0));
    const expenses = current.filter((tx) => tx.type === 'expense');
    const spending = sum(expenses.map((tx) => Number(tx.amount) || 0));
    const remaining = income - spending;
    let available = remaining;

    if (state.rolloverEnabled) {
      const [budgets, rollovers] = await Promise.all([
        FFDB.getAll('budgets'),
        FFDB.getAll('rollovers')
      ]);
      const monthBudgets = budgets.filter((budget) => budget.month === state.month);
      if (monthBudgets.length) {
        const expenseTotals = mapSum(expenses, (tx) => tx.category || 'Uncategorized', (tx) => Number(tx.amount) || 0);
        const rolloverMap = rollovers
          .filter((entry) => entry.ym === state.month)
          .reduce((acc, entry) => {
            acc[entry.category] = Number(entry.amount) || 0;
            return acc;
          }, {});
        let totalBudget = 0;
        let totalRollover = 0;
        let totalSpentAgainstBudget = 0;
        monthBudgets.forEach((budget) => {
          const budgetAmount = Number(budget.amount) || 0;
          totalBudget += budgetAmount;
          const spent = expenseTotals[budget.category] || 0;
          totalSpentAgainstBudget += spent;
          const rolloverIn = rolloverMap[budget.category] || 0;
          totalRollover += rolloverIn;
        });
        available = roundCurrency(totalBudget + totalRollover - totalSpentAgainstBudget);
      }
    }

    const labelEl = mainEl.querySelector('[data-role="remaining-label"]');
    if (labelEl) {
      labelEl.textContent = state.rolloverEnabled ? 'Available' : 'Remaining';
    }

    mainEl.querySelector('[data-metric="income"]').textContent = money(income);
    mainEl.querySelector('[data-metric="spending"]').textContent = money(spending);
    mainEl.querySelector('[data-metric="remaining"]').textContent = money(state.rolloverEnabled ? available : remaining);

    const categories = groupBy(expenses, (tx) => tx.category || 'Uncategorized');
    const list = mainEl.querySelector('[data-list="category-summary"]');
    list.innerHTML = '';
    if (Object.keys(categories).length === 0) {
      list.appendChild(emptyState('No spending yet this month.'));
    } else {
      Object.entries(categories).forEach(([category, items]) => {
        const total = sum(items.map((tx) => Number(tx.amount) || 0));
        const li = document.createElement('li');
        const spanName = document.createElement('span');
        spanName.textContent = category;
        const spanAmount = document.createElement('span');
        spanAmount.textContent = money(total);
        li.appendChild(spanName);
        li.appendChild(spanAmount);
        list.appendChild(li);
      });
    }
    await updateNetWorthStatus();
    await renderNetWorthSparkline();
  }

  async function loadTransactions() {
    const form = document.getElementById('ffapp-form-transaction');
    const selectCategory = form.querySelector('select[name="category"]');
    fillCategoryOptions(selectCategory);
    form.reset();
    if (form.date) {
      form.date.value = isoDate(new Date());
    }

    if (!form.dataset.bound) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const record = {
          id: uuid(),
          date: formData.get('date'),
          payee: formData.get('payee'),
          amount: Number(formData.get('amount')),
          type: formData.get('type'),
          category: formData.get('category')
        };
        const recordMonth = isoMonth(record.date);
        await FFDB.put('transactions', record);
        form.reset();
        if (form.date) {
          form.date.value = record.date;
        }
        await renderTransactionsTable();
        await loadDashboardMetricsSilent();
        await recomputeRolloversFrom(recordMonth);
        await renderBudgetList();
      });
      form.dataset.bound = 'true';
    }

    const selectMonth = mainEl.querySelector('[data-filter="month"]');
    fillMonthOptions(selectMonth, state.month);
    const searchInput = mainEl.querySelector('[data-filter="search"]');

    if (selectMonth && !selectMonth.dataset.bound) {
      selectMonth.addEventListener('change', () => {
        state.month = selectMonth.value;
        renderTransactionsTable();
      });
      selectMonth.dataset.bound = 'true';
    }
    if (searchInput && !searchInput.dataset.bound) {
      searchInput.addEventListener('input', () => {
        renderTransactionsTable();
      });
      searchInput.dataset.bound = 'true';
    }

    await renderTransactionsTable();
  }

  async function renderTransactionsTable() {
    const tbody = mainEl.querySelector('[data-list="transactions"]');
    if (!tbody) return;
    const selectMonth = mainEl.querySelector('[data-filter="month"]');
    const searchInput = mainEl.querySelector('[data-filter="search"]');
    const monthValue = selectMonth ? selectMonth.value : state.month;
    const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const transactions = await FFDB.getAll('transactions');
    const filtered = transactions
      .filter((tx) => isoMonth(tx.date) === monthValue)
      .filter((tx) => {
        if (!searchValue) return true;
        const haystack = `${tx.payee} ${tx.category} ${tx.type}`.toLowerCase();
        return haystack.includes(searchValue);
      })
      .sort((a, b) => (a.date > b.date ? -1 : 1));

    tbody.innerHTML = '';
    if (!filtered.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 6;
      td.appendChild(emptyState('No transactions found.'));
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    filtered.forEach((tx) => {
      const tr = document.createElement('tr');
      const txMonth = isoMonth(tx.date);
      tr.innerHTML = `
        <td>${escapeHTML(tx.date)}</td>
        <td>${escapeHTML(tx.payee || '')}</td>
        <td>${escapeHTML(tx.category || '')}</td>
        <td><span data-chip>${escapeHTML(tx.type)}</span></td>
        <td>${money(Number(tx.amount) || 0)}</td>
        <td><button type="button" data-action="delete" data-id="${escapeHTML(tx.id)}" data-month="${escapeHTML(txMonth)}">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const monthValue = btn.dataset.month || '';
        await FFDB.del('transactions', btn.dataset.id);
        await renderTransactionsTable();
        await loadDashboardMetricsSilent();
        await recomputeRolloversFrom(monthValue);
        await renderBudgetList();
      });
    });
  }

  async function loadBudget() {
    const form = document.getElementById('ffapp-form-budget');
    const selectCategory = form.querySelector('select[name="category"]');
    fillCategoryOptions(selectCategory);
    form.reset();

    if (!form.dataset.bound) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const category = formData.get('category');
        const amount = Number(formData.get('amount'));
        const record = {
          id: `${state.month}-${category}`,
          month: state.month,
          category,
          amount
        };
        await FFDB.put('budgets', record);
        form.reset();
        await recomputeRolloversFrom(record.month);
        await renderBudgetList();
        await loadDashboardMetricsSilent();
      });
      form.dataset.bound = 'true';
    }

    const selectMonth = mainEl.querySelector('[data-filter="month"]');
    fillMonthOptions(selectMonth, state.month);
    if (selectMonth && !selectMonth.dataset.bound) {
      selectMonth.addEventListener('change', async () => {
        state.month = selectMonth.value;
        await renderBudgetList();
      });
      selectMonth.dataset.bound = 'true';
    }

    await ensureRolloverProcessing();
    await renderBudgetList();
  }

  async function renderBudgetList() {
    const tbody = mainEl.querySelector('[data-list="budgets"]');
    if (!tbody) return;
    const selectMonth = mainEl.querySelector('[data-filter="month"]');
    const monthValue = selectMonth ? selectMonth.value : state.month;

    const [budgets, transactions, rollovers] = await Promise.all([
      FFDB.getAll('budgets'),
      FFDB.getAll('transactions'),
      FFDB.getAll('rollovers')
    ]);
    const monthBudgets = budgets.filter((budget) => budget.month === monthValue);
    const monthExpenses = transactions.filter((tx) => tx.type === 'expense' && isoMonth(tx.date) === monthValue);
    const expenseTotals = mapSum(monthExpenses, (tx) => tx.category || 'Uncategorized', (tx) => Number(tx.amount) || 0);
    const rolloverMap = rollovers
      .filter((entry) => entry.ym === monthValue)
      .reduce((acc, entry) => {
        acc[entry.category] = Number(entry.amount) || 0;
        return acc;
      }, {});

    tbody.innerHTML = '';
    if (!monthBudgets.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 7;
      td.appendChild(emptyState('No budgets set for this month.'));
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    monthBudgets
      .slice()
      .sort((a, b) => a.category.localeCompare(b.category))
      .forEach((budget) => {
        const budgetAmount = Number(budget.amount) || 0;
        const spent = expenseTotals[budget.category] || 0;
        const rolloverIn = rolloverMap[budget.category] || 0;
        const displayRollover = state.rolloverEnabled ? rolloverIn : 0;
        const available = roundCurrency(budgetAmount + displayRollover - spent);
        const status = budgetStatusFor(available);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHTML(budget.category)}</td>
          <td class="is-number">${money(budgetAmount)}</td>
          <td class="is-number">${money(spent)}</td>
          <td class="is-number">${money(displayRollover)}</td>
          <td class="is-number">${money(available)}</td>
          <td><span class="ffapp-budget-status ${status.className}">${status.label}</span></td>
          <td><button type="button" data-action="delete" data-id="${escapeHTML(budget.id)}" data-month="${escapeHTML(budget.month)}">Delete</button></td>
        `;
        tbody.appendChild(tr);
        const deleteBtn = tr.querySelector('[data-action="delete"]');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', async () => {
            await FFDB.del('budgets', budget.id);
            await recomputeRolloversFrom(budget.month);
            await renderBudgetList();
            await loadDashboardMetricsSilent();
          });
        }
      });
  }

  async function loadGoals() {
    const form = document.getElementById('ffapp-form-goal');
    form.reset();
    if (!form.dataset.bound) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const record = {
          id: uuid(),
          name: formData.get('name'),
          target: Number(formData.get('target')),
          due: formData.get('due'),
          progress: 0
        };
        await FFDB.put('goals', record);
        form.reset();
        await renderGoals();
      });
      form.dataset.bound = 'true';
    }

    await renderGoals();
  }

  async function renderGoals() {
    const list = mainEl.querySelector('[data-list="goals"]');
    if (!list) return;
    const goals = await FFDB.getAll('goals');
    list.innerHTML = '';
    if (!goals.length) {
      list.appendChild(emptyState('Create your first goal.'));
      return;
    }

    goals.sort((a, b) => (a.due > b.due ? 1 : -1)).forEach((goal) => {
      const li = document.createElement('li');
      const left = document.createElement('div');
      left.style.display = 'flex';
      left.style.flexDirection = 'column';
      left.style.gap = '4px';
      const title = document.createElement('strong');
      title.textContent = goal.name;
      const detail = document.createElement('span');
      detail.textContent = `Target ${money(goal.target)} · Due ${goal.due}`;
      const progress = document.createElement('span');
      const percent = goal.target ? Math.min(100, Math.round((goal.progress / goal.target) * 100)) : 0;
      progress.textContent = `Progress ${money(goal.progress)} (${percent}%)`;
      left.appendChild(title);
      left.appendChild(detail);
      left.appendChild(progress);

      const buttons = document.createElement('div');
      buttons.className = 'ffapp-inline';
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.textContent = 'Add progress';
      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.textContent = 'Reset';
      buttons.appendChild(addBtn);
      buttons.appendChild(resetBtn);

      li.appendChild(left);
      li.appendChild(buttons);
      list.appendChild(li);

      addBtn.addEventListener('click', async () => {
        const input = window.prompt('Amount to add:', '0');
        if (input === null) return;
        const value = Number(input);
        if (!Number.isFinite(value)) return;
        goal.progress = Math.max(0, (goal.progress || 0) + value);
        await FFDB.put('goals', goal);
        await renderGoals();
      });

      resetBtn.addEventListener('click', async () => {
        goal.progress = 0;
        await FFDB.put('goals', goal);
        await renderGoals();
      });
    });
  }

  async function loadNetWorth() {
    const assetForm = document.getElementById('ffapp-form-asset');
    const liabilityForm = document.getElementById('ffapp-form-liability');

    assetForm.reset();
    liabilityForm.reset();

    if (!assetForm.dataset.bound) {
      assetForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(assetForm);
        await FFDB.put('assets', {
          id: uuid(),
          name: formData.get('name'),
          value: Number(formData.get('value'))
        });
        assetForm.reset();
        await renderNetWorthLists();
        await updateNetWorthStatus();
      });
      assetForm.dataset.bound = 'true';
    }

    if (!liabilityForm.dataset.bound) {
      liabilityForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(liabilityForm);
        await FFDB.put('liabilities', {
          id: uuid(),
          name: formData.get('name'),
          value: Number(formData.get('value'))
        });
        liabilityForm.reset();
        await renderNetWorthLists();
        await updateNetWorthStatus();
      });
      liabilityForm.dataset.bound = 'true';
    }

    await renderNetWorthLists();
    await updateNetWorthStatus();
  }

  async function renderNetWorthLists() {
    const [assets, liabilities] = await Promise.all([
      FFDB.getAll('assets'),
      FFDB.getAll('liabilities')
    ]);
    const assetsList = mainEl.querySelector('[data-list="assets"]');
    const liabilitiesList = mainEl.querySelector('[data-list="liabilities"]');
    fillNetList(assetsList, assets, 'assets');
    fillNetList(liabilitiesList, liabilities, 'liabilities');
  }

  function fillNetList(container, items, store) {
    if (!container) return;
    container.innerHTML = '';
    if (!items.length) {
      container.appendChild(emptyState('Nothing recorded.'));
      return;
    }
    items.forEach((item) => {
      const li = document.createElement('li');
      const spanName = document.createElement('span');
      spanName.textContent = `${item.name}`;
      const spanValue = document.createElement('span');
      spanValue.textContent = money(Number(item.value) || 0);
      const del = document.createElement('button');
      del.type = 'button';
      del.textContent = 'Delete';
      del.addEventListener('click', async () => {
        await FFDB.del(store, item.id);
        await renderNetWorthLists();
        await updateNetWorthStatus();
      });
      li.appendChild(spanName);
      li.appendChild(spanValue);
      li.appendChild(del);
      container.appendChild(li);
    });
  }

  async function loadInvestments() {
    const form = document.getElementById('ffapp-form-investment');
    form.reset();
    if (!form.dataset.bound) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        await FFDB.put('investments', {
          id: uuid(),
          ticker: formData.get('ticker'),
          name: formData.get('name'),
          units: Number(formData.get('units')),
          cost: Number(formData.get('cost'))
        });
        form.reset();
        await renderInvestments();
      });
      form.dataset.bound = 'true';
    }

    await renderInvestments();
  }

  async function renderInvestments() {
    const list = mainEl.querySelector('[data-list="investments"]');
    if (!list) return;
    const holdings = await FFDB.getAll('investments');
    list.innerHTML = '';
    if (!holdings.length) {
      list.appendChild(emptyState('No investments recorded.'));
      return;
    }
    holdings.forEach((holding) => {
      const totalCost = (Number(holding.units) || 0) * (Number(holding.cost) || 0);
      const li = document.createElement('li');
      const info = document.createElement('div');
      info.style.display = 'flex';
      info.style.flexDirection = 'column';
      info.style.gap = '4px';
      const title = document.createElement('strong');
      title.textContent = `${holding.ticker} · ${holding.name}`;
      const detail = document.createElement('span');
      detail.textContent = `${Number(holding.units) || 0} units @ ${money(Number(holding.cost) || 0)} · Total ${money(totalCost)}`;
      info.appendChild(title);
      info.appendChild(detail);
      const del = document.createElement('button');
      del.type = 'button';
      del.textContent = 'Delete';
      del.addEventListener('click', async () => {
        await FFDB.del('investments', holding.id);
        await renderInvestments();
      });
      li.appendChild(info);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  async function loadSettings() {
    const settingsForm = document.getElementById('ffapp-form-settings');
    const currencySelect = settingsForm.querySelector('select[name="currency"]');
    const rolloverToggle = settingsForm.querySelector('input[name="budgetRollover"]');
    currencySelect.value = state.currency;
    if (!currencySelect.dataset.bound) {
      currencySelect.addEventListener('change', async () => {
        state.currency = currencySelect.value;
        refreshFormatter();
        await FFDB.setSetting('currency', state.currency);
        await updateNetWorthStatus();
        await loadDashboardMetricsSilent();
        await renderBudgetList();
      });
      currencySelect.dataset.bound = 'true';
    }
    if (rolloverToggle) {
      rolloverToggle.checked = state.rolloverEnabled;
      if (!rolloverToggle.dataset.bound) {
        rolloverToggle.addEventListener('change', async () => {
          state.rolloverEnabled = rolloverToggle.checked;
          await FFDB.setSetting(ROLLOVER_SETTING_KEY, state.rolloverEnabled);
          await loadDashboardMetricsSilent();
          await renderBudgetList();
        });
        rolloverToggle.dataset.bound = 'true';
      }
    }

    const categoryForm = document.getElementById('ffapp-form-category');
    if (!categoryForm.dataset.bound) {
      categoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(categoryForm);
        const name = (formData.get('name') || '').trim();
        if (!name) return;
        if (!state.categories.includes(name)) {
          state.categories.push(name);
          await FFDB.setSetting('categories', state.categories);
          categoryForm.reset();
          renderCategoryList();
          refreshCategoryInputs();
        }
      });
      categoryForm.dataset.bound = 'true';
    }

    renderCategoryList();
    setupDataControls();
  }

  function renderCategoryList() {
    const list = mainEl.querySelector('[data-list="categories"]');
    if (!list) return;
    list.innerHTML = '';
    if (!state.categories.length) {
      list.appendChild(emptyState('No categories.'));
      return;
    }
    state.categories.forEach((category) => {
      const li = document.createElement('li');
      li.textContent = category;
      const del = document.createElement('button');
      del.type = 'button';
      del.textContent = 'Remove';
      del.addEventListener('click', async () => {
        state.categories = state.categories.filter((cat) => cat !== category);
        await FFDB.setSetting('categories', state.categories);
        renderCategoryList();
        refreshCategoryInputs();
      });
      li.appendChild(del);
      list.appendChild(li);
    });
    refreshCategoryInputs();
  }

  function setupDataControls() {
    const exportBtn = document.getElementById('ffapp-export');
    const importInput = document.getElementById('ffapp-import');
    const wipeBtn = document.getElementById('ffapp-wipe');
    const output = document.getElementById('ffapp-export-output');
    const rebuildBtn = document.getElementById('ffapp-rebuild-networth');

    if (!exportBtn.dataset.bound) {
      exportBtn.addEventListener('click', async () => {
        const data = await FFDB.exportAll();
        output.value = JSON.stringify(data, null, 2);
        output.focus();
        output.select();
      });
      exportBtn.dataset.bound = 'true';
    }

    if (!importInput.dataset.bound) {
      importInput.addEventListener('change', async () => {
        const file = importInput.files[0];
        if (!file) return;
        try {
          const text = await file.text();
          const payload = JSON.parse(text);
          await FFDB.importAll(payload);
          const storedCategories = await FFDB.getSetting('categories');
          const storedCurrency = await FFDB.getSetting('currency');
          const storedRollover = await FFDB.getSetting(ROLLOVER_SETTING_KEY);
          state.categories = Array.isArray(storedCategories) ? storedCategories : [...DEFAULT_CATEGORIES];
          state.currency = typeof storedCurrency === 'string' ? storedCurrency : 'EUR';
          state.rolloverEnabled = typeof storedRollover === 'boolean' ? storedRollover : true;
          if (typeof storedRollover !== 'boolean') {
            await FFDB.setSetting(ROLLOVER_SETTING_KEY, state.rolloverEnabled);
          }
          refreshFormatter();
          const budgets = await FFDB.getAll('budgets');
          let earliestMonth = null;
          budgets.forEach((budget) => {
            if (budget && typeof budget.month === 'string') {
              if (!earliestMonth || compareMonth(budget.month, earliestMonth) < 0) {
                earliestMonth = budget.month;
              }
            }
          });
          importInput.value = '';
          await updateNetWorthStatus();
          refreshCategoryInputs();
          await recomputeRolloversFrom(earliestMonth || previousMonthValue(isoMonth(new Date())));
          await renderBudgetList();
          await loadDashboardMetricsSilent();
          navigate('dashboard');
        } catch (error) {
          output.value = `Import failed: ${error.message}`;
        }
      });
      importInput.dataset.bound = 'true';
    }

    if (rebuildBtn && !rebuildBtn.dataset.bound) {
      rebuildBtn.addEventListener('click', async () => {
        rebuildBtn.disabled = true;
        try {
          await rebuildNetWorthHistory();
        } catch (error) {
          console.error(error);
        } finally {
          rebuildBtn.disabled = false;
        }
      });
      rebuildBtn.dataset.bound = 'true';
    }

    if (!wipeBtn.dataset.bound) {
      wipeBtn.addEventListener('click', async () => {
        if (!window.confirm('This will remove all local finance data. Continue?')) return;
        await FFDB.clearAll();
        state.categories = [...DEFAULT_CATEGORIES];
        state.currency = 'EUR';
        state.rolloverEnabled = true;
        refreshFormatter();
        await FFDB.setSetting('categories', state.categories);
        await FFDB.setSetting('currency', state.currency);
        await FFDB.setSetting(ROLLOVER_SETTING_KEY, state.rolloverEnabled);
        await FFDB.setSetting(ROLLOVER_LAST_PROCESSED_KEY, previousMonthValue(isoMonth(new Date())));
        await updateNetWorthStatus();
        refreshCategoryInputs();
        await renderBudgetList();
        await loadDashboardMetricsSilent();
        navigate('dashboard');
      });
      wipeBtn.dataset.bound = 'true';
    }
  }

  async function loadDashboardMetricsSilent() {
    if (state.route === 'dashboard') {
      await loadDashboard();
    }
  }

  function fillCategoryOptions(select) {
    if (!select) return;
    select.innerHTML = '';
    state.categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });
  }

  function refreshCategoryInputs() {
    const transactionForm = document.getElementById('ffapp-form-transaction');
    if (transactionForm) {
      fillCategoryOptions(transactionForm.querySelector('select[name="category"]'));
    }
    const budgetForm = document.getElementById('ffapp-form-budget');
    if (budgetForm) {
      fillCategoryOptions(budgetForm.querySelector('select[name="category"]'));
    }
  }

  function fillMonthOptions(select, value) {
    if (!select) return;
    select.innerHTML = '';
    monthOptions().forEach((optionMonth) => {
      const option = document.createElement('option');
      option.value = optionMonth.value;
      option.textContent = optionMonth.label;
      if (optionMonth.value === value) {
        option.selected = true;
      }
      select.appendChild(option);
    });
  }

  async function updateNetWorthStatus() {
    const { netWorth } = await computeNetWorthTotals();
    await ensureCurrentMonthNetWorthSnapshot(netWorth);
    if (statusEl) {
      statusEl.textContent = `Net worth: ${money(netWorth)}`;
    }
  }

  async function renderNetWorthSparkline() {
    if (!mainEl) return;
    const canvas = mainEl.querySelector('#ffapp-networth-sparkline');
    if (!canvas) return;
    const snapshots = await FFDB.getAll('nw_snapshots');
    const sorted = snapshots
      .filter((snapshot) => snapshot && typeof snapshot.ym === 'string')
      .sort((a, b) => compareMonth(a.ym, b.ym));
    const recent = sorted.slice(-NET_WORTH_HISTORY_MONTHS);
    drawNetWorthSparkline(canvas, recent);
  }

  async function computeNetWorthTotals() {
    const [assets, liabilities] = await Promise.all([
      FFDB.getAll('assets'),
      FFDB.getAll('liabilities')
    ]);
    const totalAssets = sum(assets.map((asset) => Number(asset.value) || 0));
    const totalLiabilities = sum(liabilities.map((item) => Number(item.value) || 0));
    const netWorth = totalAssets - totalLiabilities;
    return {
      totalAssets: roundCurrency(totalAssets),
      totalLiabilities: roundCurrency(totalLiabilities),
      netWorth: roundCurrency(netWorth)
    };
  }

  async function ensureCurrentMonthNetWorthSnapshot(netWorth) {
    const ym = isoMonth(new Date());
    const rounded = roundCurrency(netWorth);
    const [lastRecorded, snapshots] = await Promise.all([
      FFDB.getSetting(NET_WORTH_LAST_SNAPSHOT_KEY),
      FFDB.getAll('nw_snapshots')
    ]);
    const existing = snapshots.find((snapshot) => snapshot && snapshot.ym === ym);
    if (existing) {
      if (roundCurrency(existing.netWorth) !== rounded) {
        await FFDB.put('nw_snapshots', { ...existing, netWorth: rounded });
      }
      if (lastRecorded !== ym) {
        await FFDB.setSetting(NET_WORTH_LAST_SNAPSHOT_KEY, ym);
      }
      return;
    }
    await FFDB.put('nw_snapshots', { id: uuid(), ym, netWorth: rounded });
    if (lastRecorded !== ym) {
      await FFDB.setSetting(NET_WORTH_LAST_SNAPSHOT_KEY, ym);
    }
    await pruneNetWorthSnapshots();
  }

  async function pruneNetWorthSnapshots(limit = NET_WORTH_HISTORY_MONTHS) {
    if (!Number.isFinite(limit) || limit <= 0) {
      return;
    }
    const snapshots = await FFDB.getAll('nw_snapshots');
    if (!snapshots.length || snapshots.length <= limit) {
      return;
    }
    const sorted = snapshots
      .filter((snapshot) => snapshot && typeof snapshot.ym === 'string')
      .sort((a, b) => compareMonth(a.ym, b.ym));
    const toRemove = sorted.slice(0, Math.max(0, sorted.length - limit));
    await Promise.all(toRemove.map((snapshot) => FFDB.del('nw_snapshots', snapshot.id)));
  }

  async function rebuildNetWorthHistory() {
    const { netWorth } = await computeNetWorthTotals();
    const months = getRecentMonths(NET_WORTH_HISTORY_MONTHS);
    const snapshots = await FFDB.getAll('nw_snapshots');
    const rounded = roundCurrency(netWorth);
    const operations = [];

    months.forEach((ym) => {
      const existing = snapshots.find((snapshot) => snapshot && snapshot.ym === ym);
      if (existing) {
        if (roundCurrency(existing.netWorth) !== rounded) {
          operations.push(FFDB.put('nw_snapshots', { ...existing, netWorth: rounded }));
        }
      } else {
        operations.push(FFDB.put('nw_snapshots', { id: uuid(), ym, netWorth: rounded }));
      }
    });

    snapshots.forEach((snapshot) => {
      if (snapshot && !months.includes(snapshot.ym)) {
        operations.push(FFDB.del('nw_snapshots', snapshot.id));
      }
    });

    await Promise.all(operations);
    if (months.length) {
      await FFDB.setSetting(NET_WORTH_LAST_SNAPSHOT_KEY, months[months.length - 1]);
    }
    await ensureCurrentMonthNetWorthSnapshot(rounded);
    if (statusEl) {
      statusEl.textContent = `Net worth: ${money(rounded)}`;
    }
    if (state.route === 'dashboard') {
      await renderNetWorthSparkline();
    }
  }

  function drawNetWorthSparkline(canvas, snapshots) {
    const context = canvas.getContext('2d');
    if (!context) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = Math.max(rect.width, 160);
    const displayHeight = Math.max(rect.height, 80);
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    if (typeof context.setTransform === 'function') {
      context.setTransform(1, 0, 0, 1, 0, 0);
    }
    context.scale(dpr, dpr);
    context.clearRect(0, 0, displayWidth, displayHeight);

    const accent = getAppColor('--ffapp-accent', '#4f8ef7');
    const muted = getAppColor('--ffapp-muted', '#9aa1b3');
    const surface = getAppColor('--ffapp-surface', 'rgba(30, 32, 38, 0.9)');
    const text = getAppColor('--ffapp-text', '#f3f5f9');
    const font = `12px ${getAppFontFamily()}`;

    context.font = font;
    context.textBaseline = 'middle';
    context.lineJoin = 'round';
    context.lineCap = 'round';

    if (!snapshots.length) {
      context.fillStyle = muted;
      context.fillText('No data yet', 12, displayHeight / 2);
      return;
    }

    const values = snapshots.map((snapshot) => Number(snapshot.netWorth) || 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const paddingX = 12;
    const paddingY = 12;
    const chartWidth = Math.max(displayWidth - paddingX * 2, 1);
    const chartHeight = Math.max(displayHeight - paddingY * 2, 1);
    const stepX = snapshots.length > 1 ? chartWidth / (snapshots.length - 1) : 0;

    const points = snapshots.map((snapshot, index) => {
      const value = Number(snapshot.netWorth) || 0;
      const ratio = range === 0 ? 0.5 : (value - min) / range;
      const x = paddingX + (snapshots.length === 1 ? chartWidth / 2 : stepX * index);
      const y = paddingY + chartHeight - ratio * chartHeight;
      return { x, y, value };
    });

    context.strokeStyle = accent;
    context.lineWidth = 2;
    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.stroke();

    context.fillStyle = accent;
    points.forEach((point) => {
      context.beginPath();
      context.arc(point.x, point.y, 3, 0, Math.PI * 2);
      context.fill();
    });

    const last = points[points.length - 1];
    const label = money(last.value);
    const textMetrics = context.measureText(label);
    const labelPaddingX = 6;
    const labelPaddingY = 4;
    const labelWidth = textMetrics.width + labelPaddingX * 2;
    const labelHeight = 20;
    let labelX = last.x + 8;
    if (labelX + labelWidth > displayWidth - 4) {
      labelX = displayWidth - labelWidth - 4;
    }
    if (labelX < paddingX) {
      labelX = paddingX;
    }
    let labelCenterY = last.y;
    if (labelCenterY - labelHeight / 2 < 4) {
      labelCenterY = 4 + labelHeight / 2;
    } else if (labelCenterY + labelHeight / 2 > displayHeight - 4) {
      labelCenterY = displayHeight - 4 - labelHeight / 2;
    }

    drawRoundedRectPath(context, labelX, labelCenterY - labelHeight / 2, labelWidth, labelHeight, 6);
    context.fillStyle = surface;
    context.fill();
    context.strokeStyle = accent;
    context.lineWidth = 1;
    context.stroke();

    context.fillStyle = text;
    context.fillText(label, labelX + labelPaddingX, labelCenterY);
  }

  function drawRoundedRectPath(context, x, y, width, height, radius) {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    context.beginPath();
    context.moveTo(x + r, y);
    context.lineTo(x + width - r, y);
    context.quadraticCurveTo(x + width, y, x + width, y + r);
    context.lineTo(x + width, y + height - r);
    context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    context.lineTo(x + r, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - r);
    context.lineTo(x, y + r);
    context.quadraticCurveTo(x, y, x + r, y);
    context.closePath();
  }

  function getRecentMonths(limit) {
    const months = [];
    if (!Number.isFinite(limit) || limit <= 0) {
      return months;
    }
    const now = new Date();
    for (let i = limit - 1; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(isoMonth(date));
    }
    return months;
  }

  function getAppColor(variable, fallback) {
    if (!appEl) return fallback;
    const styles = getComputedStyle(appEl);
    const value = styles.getPropertyValue(variable) || styles[variable];
    return value ? value.trim() : fallback;
  }

  function getAppFontFamily() {
    if (!appEl) return 'system-ui, sans-serif';
    const styles = getComputedStyle(appEl);
    return styles.fontFamily || 'system-ui, sans-serif';
  }

  function openCsvModal() {
    if (!csvElements.modal || !csvElements.dialog) {
      return;
    }
    csvElements.modal.setAttribute('aria-hidden', 'false');
    if (!csvModalOpen) {
      csvModalOpen = true;
      csvPreviousFocus = document.activeElement;
      csvElements.modal.addEventListener('keydown', handleCsvModalKeydown, true);
    }
    window.requestAnimationFrame(() => {
      const focusable = getCsvFocusableElements();
      if (focusable.length) {
        focusable[0].focus();
      } else {
        csvElements.dialog.focus();
      }
    });
  }

  function closeCsvModal() {
    if (!csvElements.modal) {
      return;
    }
    csvElements.modal.setAttribute('aria-hidden', 'true');
    if (csvModalOpen) {
      csvElements.modal.removeEventListener('keydown', handleCsvModalKeydown, true);
    }
    csvModalOpen = false;
    if (csvElements.form) {
      csvElements.form.reset();
    }
    csvState.rows = [];
    csvState.headers = [];
    csvState.records = [];
    csvState.skipped = 0;
    updateCsvSelectOptions([]);
    clearCsvPreview();
    showCsvMessage('', false);
    if (csvElements.fileInput) {
      csvElements.fileInput.value = '';
    }
    if (csvPreviousFocus && typeof csvPreviousFocus.focus === 'function') {
      csvPreviousFocus.focus();
    }
    csvPreviousFocus = null;
  }

  function updateCsvSelectOptions(headers) {
    if (!Array.isArray(csvElements.selects)) {
      return;
    }
    csvElements.selects.forEach((select) => {
      const current = select.value;
      select.innerHTML = '';
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Select column';
      select.appendChild(placeholder);
      headers.forEach((header) => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        select.appendChild(option);
      });
      if (headers.includes(current)) {
        select.value = current;
      } else {
        select.value = '';
      }
    });
  }

  function applySavedCsvMapping(headers) {
    const saved = loadCsvMapping();
    const guessed = guessCsvMapping(headers);
    csvElements.selects.forEach((select) => {
      const field = select.dataset.map;
      const preferred = (saved && saved[field]) || guessed[field] || '';
      if (preferred && headers.includes(preferred)) {
        select.value = preferred;
      } else {
        select.value = '';
      }
    });
  }

  function getCsvMapping() {
    const mapping = {};
    csvElements.selects.forEach((select) => {
      mapping[select.dataset.map] = select.value;
    });
    return mapping;
  }

  function isCsvMappingValid(mapping) {
    return Boolean(mapping.date && mapping.amount);
  }

  function updateCsvPreview() {
    if (!csvElements.previewBody || !csvElements.importButton) {
      return;
    }
    const mapping = getCsvMapping();
    csvElements.importButton.disabled = true;
    if (!csvState.headers.length) {
      renderCsvPreviewMessage('Upload a CSV file to begin.');
      showCsvMessage('Upload a CSV file to begin.', false);
      return;
    }
    if (!isCsvMappingValid(mapping)) {
      renderCsvPreviewMessage('Select the required columns to preview your data.');
      showCsvMessage('Select the required columns to preview your data.', false);
      return;
    }
    const result = transformCsvRows(mapping);
    if (!result.records.length) {
      renderCsvPreviewMessage('No valid rows detected for this mapping.');
      showCsvMessage('No valid rows to import with the current mapping.', true);
      return;
    }
    renderCsvPreviewRecords(result.records.slice(0, 10));
    const summary = `Ready to import ${result.records.length} transaction${result.records.length === 1 ? '' : 's'}.${result.skipped ? ` ${result.skipped} row${result.skipped === 1 ? '' : 's'} skipped.` : ''}`;
    showCsvMessage(summary, false, true);
    csvElements.importButton.disabled = false;
  }

  function renderCsvPreviewRecords(records) {
    if (!csvElements.previewBody) {
      return;
    }
    csvElements.previewBody.innerHTML = '';
    records.forEach((record) => {
      const tr = document.createElement('tr');
      const values = [
        record.date,
        record.payee,
        record.category,
        record.type,
        money(record.type === 'expense' ? -record.amount : record.amount)
      ];
      values.forEach((value) => {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
      });
      csvElements.previewBody.appendChild(tr);
    });
  }

  function renderCsvPreviewMessage(message) {
    if (!csvElements.previewBody) {
      return;
    }
    csvElements.previewBody.innerHTML = '';
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5;
    td.appendChild(emptyState(message));
    tr.appendChild(td);
    csvElements.previewBody.appendChild(tr);
  }

  function clearCsvPreview() {
    if (csvElements.previewBody) {
      renderCsvPreviewMessage('No preview available yet.');
    }
    if (csvElements.importButton) {
      csvElements.importButton.disabled = true;
    }
    csvState.records = [];
    csvState.skipped = 0;
  }

  function showCsvMessage(text, isError = false, isSuccess = false) {
    if (!csvElements.message) {
      return;
    }
    csvElements.message.textContent = text || '';
    csvElements.message.classList.remove('is-error', 'is-success');
    if (isError) {
      csvElements.message.classList.add('is-error');
    } else if (isSuccess) {
      csvElements.message.classList.add('is-success');
    }
  }

  function getCsvFocusableElements() {
    if (!csvElements.dialog) {
      return [];
    }
    return Array.from(csvElements.dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
      const visible = element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;
      return !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true' && visible;
    });
  }

  function handleCsvModalKeydown(event) {
    if (!csvModalOpen) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeCsvModal();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const focusable = getCsvFocusableElements();
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === first || document.activeElement === csvElements.dialog) {
        event.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function transformCsvRows(mapping) {
    const indices = {};
    Object.keys(mapping).forEach((key) => {
      const header = mapping[key];
      indices[key] = header ? csvState.headers.indexOf(header) : -1;
    });
    const datePreference = detectCsvDatePreference(csvState.rows, indices.date);
    const records = [];
    let skipped = 0;
    csvState.rows.forEach((row) => {
      const record = mapCsvRow(row, indices, datePreference);
      if (record) {
        records.push(record);
      } else {
        skipped += 1;
      }
    });
    csvState.records = records;
    csvState.skipped = skipped;
    return { records, skipped };
  }

  function mapCsvRow(row, indices, preference) {
    const dateValue = getValueFromRow(row, indices.date);
    const normalizedDate = normalizeCsvDate(dateValue, preference);
    if (!normalizedDate) {
      return null;
    }
    const amountValue = getValueFromRow(row, indices.amount);
    const numericAmount = parseCsvNumber(amountValue);
    if (!Number.isFinite(numericAmount) || numericAmount === 0) {
      return null;
    }
    const typeValue = getValueFromRow(row, indices.type);
    const normalizedType = normalizeCsvType(typeValue, numericAmount);
    if (!normalizedType) {
      return null;
    }
    const payeeValue = getValueFromRow(row, indices.payee);
    const categoryValue = getValueFromRow(row, indices.category);
    return {
      date: normalizedDate,
      payee: payeeValue || 'Unknown',
      category: categoryValue || 'Uncategorized',
      type: normalizedType,
      amount: Math.abs(numericAmount)
    };
  }

  function getValueFromRow(row, index) {
    if (typeof index !== 'number' || index < 0) {
      return '';
    }
    const value = index < row.length ? row[index] : '';
    return String(value || '').trim();
  }

  function detectCsvDatePreference(rows, dateIndex) {
    if (typeof dateIndex !== 'number' || dateIndex < 0) {
      return state.currency === 'USD' ? 'MM/DD' : 'DD/MM';
    }
    let ddmm = 0;
    let mmdd = 0;
    for (let i = 0; i < rows.length && i < 50; i += 1) {
      const value = String(getValueFromRow(rows[i], dateIndex) || '').trim();
      if (!value || /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        continue;
      }
      const normalized = value.replace(/\./g, '/').replace(/-/g, '/');
      const parts = normalized.split('/');
      if (parts.length !== 3) {
        continue;
      }
      const first = parseInt(parts[0], 10);
      const second = parseInt(parts[1], 10);
      if (!Number.isFinite(first) || !Number.isFinite(second)) {
        continue;
      }
      if (first > 12 && second <= 12) {
        ddmm += 1;
      } else if (second > 12 && first <= 12) {
        mmdd += 1;
      }
    }
    if (ddmm > mmdd) {
      return 'DD/MM';
    }
    if (mmdd > ddmm) {
      return 'MM/DD';
    }
    return state.currency === 'USD' ? 'MM/DD' : 'DD/MM';
  }

  function normalizeCsvDate(value, preference) {
    const raw = String(value || '').trim();
    if (!raw) {
      return null;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return raw;
    }
    const normalized = raw.replace(/\./g, '/').replace(/-/g, '/');
    const parts = normalized.split('/');
    if (parts.length !== 3) {
      return null;
    }
    const first = parseInt(parts[0], 10);
    const second = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (!Number.isFinite(first) || !Number.isFinite(second) || !Number.isFinite(year)) {
      return null;
    }
    if (year < 1000 || year > 9999) {
      return null;
    }
    let day;
    let month;
    if (first > 12 && second <= 12) {
      day = first;
      month = second;
    } else if (second > 12 && first <= 12) {
      month = first;
      day = second;
    } else if ((preference || '').toUpperCase() === 'MM/DD') {
      month = first;
      day = second;
    } else {
      day = first;
      month = second;
    }
    if (!isValidCalendarDate(year, month, day)) {
      return null;
    }
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function isValidCalendarDate(year, month, day) {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      return false;
    }
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }
    const test = new Date(year, month - 1, day);
    return test.getFullYear() === year && test.getMonth() === month - 1 && test.getDate() === day;
  }

  function parseCsvNumber(value) {
    if (value === null || value === undefined) {
      return NaN;
    }
    let str = String(value).trim();
    if (!str) {
      return NaN;
    }
    let negative = false;
    if (str.startsWith('(') && str.endsWith(')')) {
      negative = true;
      str = str.slice(1, -1);
    }
    str = str.replace(/\s+/g, '');
    str = str.replace(/[^0-9,.-]/g, '');
    if (!str) {
      return NaN;
    }
    const commaCount = (str.match(/,/g) || []).length;
    const dotCount = (str.match(/\./g) || []).length;
    if (commaCount && dotCount) {
      if (str.lastIndexOf('.') > str.lastIndexOf(',')) {
        str = str.replace(/,/g, '');
      } else {
        str = str.replace(/\./g, '').replace(/,/g, '.');
      }
    } else if (commaCount && !dotCount) {
      str = str.replace(/,/g, '.');
    } else {
      str = str.replace(/,/g, '');
    }
    let number = Number(str);
    if (!Number.isFinite(number)) {
      return NaN;
    }
    if (negative || str.includes('-')) {
      number = Math.abs(number) * -1;
    }
    return number;
  }

  function normalizeCsvType(value, amountValue) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw) {
      if (raw.includes('transfer') || raw.includes('transf') || raw === 'trf') {
        return 'transfer';
      }
      if (raw.includes('expense') || raw.includes('debit') || raw.includes('withdraw')) {
        return 'expense';
      }
      if (raw.includes('income') || raw.includes('credit') || raw.includes('deposit')) {
        return 'income';
      }
    }
    if (amountValue < 0) {
      return 'expense';
    }
    if (amountValue > 0) {
      return 'income';
    }
    return '';
  }

  function parseCsv(text) {
    const normalizedText = String(text || '').replace(/\uFEFF/g, '');
    const lines = normalizedText.split(/\r?\n/);
    const sampleLine = lines.find((line) => line.trim().length);
    if (!sampleLine) {
      throw new Error('File is empty.');
    }
    const delimiter = detectCsvDelimiter(sampleLine);
    const rows = [];
    lines.forEach((line) => {
      if (!line.trim()) {
        return;
      }
      const parsedRow = parseCsvRow(line, delimiter);
      if (parsedRow.some((cell) => cell.length)) {
        rows.push(parsedRow);
      }
    });
    if (!rows.length) {
      throw new Error('No data rows found.');
    }
    const headerRow = rows.shift();
    const headers = makeUniqueHeaders(headerRow);
    return { headers, rows, delimiter };
  }

  function detectCsvDelimiter(sampleLine) {
    const commaSplit = parseCsvRow(sampleLine, ',');
    const semicolonSplit = parseCsvRow(sampleLine, ';');
    if (semicolonSplit.length > commaSplit.length) {
      return ';';
    }
    if (commaSplit.length > 1) {
      return ',';
    }
    if (semicolonSplit.length > 1) {
      return ';';
    }
    return ',';
  }

  function parseCsvRow(line, delimiter) {
    const cells = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        cells.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current);
    return cells.map((cell) => sanitizeCsvValue(cell));
  }

  function sanitizeCsvValue(value) {
    const str = String(value || '').trim();
    if (str.startsWith('"') && str.endsWith('"')) {
      return str.slice(1, -1).replace(/""/g, '"').trim();
    }
    return str.replace(/""/g, '"').trim();
  }

  function makeUniqueHeaders(values) {
    const headers = [];
    const seen = {};
    values.forEach((value, index) => {
      let header = String(value || '').trim();
      if (!header) {
        header = `Column ${index + 1}`;
      }
      let unique = header;
      let counter = 1;
      while (seen[unique]) {
        counter += 1;
        unique = `${header} (${counter})`;
      }
      seen[unique] = true;
      headers.push(unique);
    });
    return headers;
  }

  function guessCsvMapping(headers) {
    const mapping = {};
    headers.forEach((header) => {
      const normalized = header.toLowerCase();
      if (!mapping.date && normalized.includes('date')) {
        mapping.date = header;
        return;
      }
      if (!mapping.amount && (normalized.includes('amount') || normalized.includes('value') || normalized.includes('total'))) {
        mapping.amount = header;
        return;
      }
      if (!mapping.payee && (normalized.includes('payee') || normalized.includes('name') || normalized.includes('description') || normalized.includes('merchant'))) {
        mapping.payee = header;
        return;
      }
      if (!mapping.type && (normalized.includes('type') || normalized.includes('direction') || normalized.includes('status'))) {
        mapping.type = header;
        return;
      }
      if (!mapping.category && normalized.includes('category')) {
        mapping.category = header;
      }
    });
    return mapping;
  }

  function loadCsvMapping() {
    try {
      const stored = localStorage.getItem(CSV_MAP_KEY);
      if (!stored) {
        return {};
      }
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (error) {
      return {};
    }
    return {};
  }

  function persistCsvMapping(mapping) {
    try {
      localStorage.setItem(CSV_MAP_KEY, JSON.stringify(mapping));
    } catch (error) {
      // Storage might be unavailable; ignore.
    }
  }

  async function recomputeRolloversFrom(startMonth) {
    const currentMonth = isoMonth(new Date());
    const previous = previousMonthValue(currentMonth);
    if (!previous) {
      return;
    }
    if (!startMonth || compareMonth(startMonth, previous) > 0) {
      await FFDB.setSetting(ROLLOVER_LAST_PROCESSED_KEY, previous);
      return;
    }
    const months = [];
    let pointer = startMonth;
    while (compareMonth(pointer, previous) <= 0) {
      months.push(pointer);
      const next = addMonthsToYearMonth(pointer, 1);
      if (!next || next === pointer) {
        break;
      }
      pointer = next;
    }
    for (const month of months) {
      await computeRolloverForMonth(month);
    }
    if (months.length) {
      await FFDB.setSetting(ROLLOVER_LAST_PROCESSED_KEY, months[months.length - 1]);
    }
  }

  async function ensureRolloverProcessing() {
    if (rolloverProcessingPromise) {
      return rolloverProcessingPromise;
    }
    rolloverProcessingPromise = (async () => {
      const currentMonth = isoMonth(new Date());
      const previous = previousMonthValue(currentMonth);
      if (!previous) {
        return;
      }
      const lastProcessed = await FFDB.getSetting(ROLLOVER_LAST_PROCESSED_KEY);
      let startMonth;
      if (typeof lastProcessed === 'string' && lastProcessed) {
        if (compareMonth(lastProcessed, previous) >= 0) {
          return;
        }
        startMonth = addMonthsToYearMonth(lastProcessed, 1);
      } else {
        startMonth = previous;
      }
      if (!startMonth) {
        return;
      }
      const months = [];
      let pointer = startMonth;
      while (compareMonth(pointer, previous) <= 0) {
        months.push(pointer);
        const next = addMonthsToYearMonth(pointer, 1);
        if (!next || next === pointer) {
          break;
        }
        pointer = next;
      }
      for (const month of months) {
        await computeRolloverForMonth(month);
      }
      if (months.length) {
        await FFDB.setSetting(ROLLOVER_LAST_PROCESSED_KEY, months[months.length - 1]);
      }
    })().finally(() => {
      rolloverProcessingPromise = null;
    });
    return rolloverProcessingPromise;
  }

  async function computeRolloverForMonth(month) {
    if (!month) {
      return;
    }
    const next = addMonthsToYearMonth(month, 1);
    if (!next) {
      return;
    }
    const [budgets, transactions, rollovers] = await Promise.all([
      FFDB.getAll('budgets'),
      FFDB.getAll('transactions'),
      FFDB.getAll('rollovers')
    ]);
    const monthBudgets = budgets.filter((budget) => budget.month === month);
    const monthExpenses = transactions.filter((tx) => tx.type === 'expense' && isoMonth(tx.date) === month);
    const expenseTotals = mapSum(monthExpenses, (tx) => tx.category || 'Uncategorized', (tx) => Number(tx.amount) || 0);
    const rolloverMap = rollovers
      .filter((entry) => entry.ym === month)
      .reduce((acc, entry) => {
        acc[entry.category] = Number(entry.amount) || 0;
        return acc;
      }, {});
    const desired = new Map();
    monthBudgets.forEach((budget) => {
      const budgetAmount = Number(budget.amount) || 0;
      const spent = expenseTotals[budget.category] || 0;
      const rolloverIn = rolloverMap[budget.category] || 0;
      const available = roundCurrency(budgetAmount + rolloverIn - spent);
      const carry = roundCurrency(Math.max(0, available));
      if (carry > 0) {
        desired.set(budget.category, carry);
      }
    });
    const nextRecords = rollovers.filter((entry) => entry.ym === next);
    const operations = [];
    desired.forEach((amount, category) => {
      operations.push(FFDB.put('rollovers', {
        id: `${next}-${category}`,
        ym: next,
        category,
        amount
      }));
    });
    nextRecords.forEach((entry) => {
      if (!desired.has(entry.category)) {
        operations.push(FFDB.del('rollovers', entry.id));
      }
    });
    await Promise.all(operations);
  }

  function budgetStatusFor(value) {
    if (value > 0) {
      return { label: 'Under budget', className: 'is-positive' };
    }
    if (value < 0) {
      return { label: 'Over budget', className: 'is-negative' };
    }
    return { label: 'On budget', className: 'is-neutral' };
  }

  function roundCurrency(value) {
    const numeric = Number(value) || 0;
    const rounded = Math.round(numeric * 100) / 100;
    return Object.is(rounded, -0) ? 0 : rounded;
  }

  function parseYearMonth(value) {
    if (typeof value !== 'string') return null;
    const parts = value.split('-');
    if (parts.length !== 2) return null;
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
    return { year, month };
  }

  function addMonthsToYearMonth(value, offset) {
    const parsed = parseYearMonth(value);
    if (!parsed || !Number.isFinite(offset)) {
      return '';
    }
    const date = new Date(parsed.year, parsed.month - 1 + offset, 1);
    return isoMonth(date);
  }

  function previousMonthValue(value) {
    return addMonthsToYearMonth(value, -1);
  }

  function compareMonth(a, b) {
    const parsedA = parseYearMonth(a);
    const parsedB = parseYearMonth(b);
    if (!parsedA || !parsedB) {
      return 0;
    }
    if (parsedA.year === parsedB.year) {
      if (parsedA.month === parsedB.month) {
        return 0;
      }
      return parsedA.month > parsedB.month ? 1 : -1;
    }
    return parsedA.year > parsedB.year ? 1 : -1;
  }
  function emptyState(message) {
    const div = document.createElement('div');
    div.className = 'ffapp-empty';
    div.textContent = message;
    return div;
  }

  function money(value) {
    return state.formatter.format(Number(value) || 0);
  }

  function sum(values) {
    return values.reduce((total, value) => total + (Number(value) || 0), 0);
  }

  function groupBy(items, iteratee) {
    return items.reduce((acc, item) => {
      const key = iteratee(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }

  function mapSum(items, keyGetter, valueGetter) {
    return items.reduce((acc, item) => {
      const key = keyGetter(item);
      const value = valueGetter(item);
      acc[key] = (acc[key] || 0) + value;
      return acc;
    }, {});
  }

  function escapeHTML(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function isoDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  function isoMonth(date) {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${month}`;
  }

  function monthOptions(length = 12) {
    const now = new Date();
    const options = [];
    for (let i = 0; i < length; i += 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = isoMonth(date);
      const label = date.toLocaleString(undefined, { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  }

  function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'ff-' + Math.random().toString(16).slice(2) + Date.now().toString(16);
  }

  window.FF = { version: '1.0.0' };
})();
