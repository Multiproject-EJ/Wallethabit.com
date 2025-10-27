(function () {
  'use strict';

  const DEFAULT_CATEGORIES = ['Rent', 'Groceries', 'Eating out', 'Transport', 'Utilities', 'Insurance', 'Health', 'Subscriptions', 'Fun', 'Misc'];
  const ROUTES = ['dashboard', 'transactions', 'budget', 'goals', 'networth', 'investments', 'settings'];

  const state = {
    route: 'dashboard',
    month: isoMonth(new Date()),
    currency: 'EUR',
    categories: [...DEFAULT_CATEGORIES],
    formatter: new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' })
  };

  let appEl;
  let mainEl;
  let statusEl;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    appEl = document.querySelector('.ffapp');
    mainEl = document.getElementById('ffapp-view');
    statusEl = document.getElementById('ffapp-status');

    setupNav();
    setupQuickAdd();
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

  async function bootstrapSettings() {
    await FFDB.open();
    const storedCategories = await FFDB.getSetting('categories');
    const storedCurrency = await FFDB.getSetting('currency');
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
    refreshFormatter();
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

    const transactions = await FFDB.getAll('transactions');
    const current = transactions.filter((tx) => isoMonth(tx.date) === state.month);
    const income = sum(current.filter((tx) => tx.type === 'income').map((tx) => Number(tx.amount) || 0));
    const spending = sum(current.filter((tx) => tx.type === 'expense').map((tx) => Number(tx.amount) || 0));
    const remaining = income - spending;

    mainEl.querySelector('[data-metric="income"]').textContent = money(income);
    mainEl.querySelector('[data-metric="spending"]').textContent = money(spending);
    mainEl.querySelector('[data-metric="remaining"]').textContent = money(remaining);

    const categories = groupBy(current.filter((tx) => tx.type === 'expense'), (tx) => tx.category || 'Uncategorized');
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
        await FFDB.put('transactions', record);
        form.reset();
        if (form.date) {
          form.date.value = record.date;
        }
        await renderTransactionsTable();
        await loadDashboardMetricsSilent();
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
      tr.innerHTML = `
        <td>${escapeHTML(tx.date)}</td>
        <td>${escapeHTML(tx.payee || '')}</td>
        <td>${escapeHTML(tx.category || '')}</td>
        <td><span data-chip>${escapeHTML(tx.type)}</span></td>
        <td>${money(Number(tx.amount) || 0)}</td>
        <td><button type="button" data-action="delete" data-id="${escapeHTML(tx.id)}">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await FFDB.del('transactions', btn.dataset.id);
        await renderTransactionsTable();
        await loadDashboardMetricsSilent();
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
        await renderBudgetList();
      });
      form.dataset.bound = 'true';
    }

    const selectMonth = mainEl.querySelector('[data-filter="month"]');
    fillMonthOptions(selectMonth, state.month);
    if (selectMonth && !selectMonth.dataset.bound) {
      selectMonth.addEventListener('change', () => {
        state.month = selectMonth.value;
        renderBudgetList();
      });
      selectMonth.dataset.bound = 'true';
    }

    await renderBudgetList();
  }

  async function renderBudgetList() {
    const list = mainEl.querySelector('[data-list="budgets"]');
    if (!list) return;
    const selectMonth = mainEl.querySelector('[data-filter="month"]');
    const monthValue = selectMonth ? selectMonth.value : state.month;

    const [budgets, transactions] = await Promise.all([
      FFDB.getAll('budgets'),
      FFDB.getAll('transactions')
    ]);
    const monthBudgets = budgets.filter((b) => b.month === monthValue);
    const monthTransactions = transactions.filter((tx) => isoMonth(tx.date) === monthValue && tx.type === 'expense');
    const totals = mapSum(monthTransactions, (tx) => tx.category || 'Uncategorized', (tx) => Number(tx.amount) || 0);

    list.innerHTML = '';
    if (!monthBudgets.length) {
      list.appendChild(emptyState('No budgets set for this month.'));
      return;
    }

    monthBudgets.forEach((budget) => {
      const actual = totals[budget.category] || 0;
      const remaining = budget.amount - actual;
      const li = document.createElement('li');
      const wrap = document.createElement('div');
      wrap.style.display = 'flex';
      wrap.style.flexDirection = 'column';
      wrap.style.gap = '4px';
      const title = document.createElement('strong');
      title.textContent = budget.category;
      const detail = document.createElement('span');
      detail.textContent = `${money(actual)} / ${money(budget.amount)}`;
      const rem = document.createElement('span');
      rem.style.color = remaining >= 0 ? 'var(--ffapp-success)' : 'var(--ffapp-danger)';
      rem.textContent = `${remaining >= 0 ? 'Remaining' : 'Over by'} ${money(Math.abs(remaining))}`;
      wrap.appendChild(title);
      wrap.appendChild(detail);
      wrap.appendChild(rem);
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.dataset.action = 'delete';
      deleteBtn.dataset.id = budget.id;
      deleteBtn.textContent = 'Delete';
      li.appendChild(wrap);
      li.appendChild(deleteBtn);
      list.appendChild(li);
      deleteBtn.addEventListener('click', async () => {
        await FFDB.del('budgets', budget.id);
        await renderBudgetList();
      });
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
    const currencyForm = document.getElementById('ffapp-form-settings');
    const currencySelect = currencyForm.querySelector('select[name="currency"]');
    currencySelect.value = state.currency;
    if (!currencySelect.dataset.bound) {
      currencySelect.addEventListener('change', async () => {
        state.currency = currencySelect.value;
        refreshFormatter();
        await FFDB.setSetting('currency', state.currency);
        await updateNetWorthStatus();
        await loadDashboardMetricsSilent();
      });
      currencySelect.dataset.bound = 'true';
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
          state.categories = Array.isArray(storedCategories) ? storedCategories : [...DEFAULT_CATEGORIES];
          state.currency = typeof storedCurrency === 'string' ? storedCurrency : 'EUR';
          refreshFormatter();
          importInput.value = '';
          await updateNetWorthStatus();
          refreshCategoryInputs();
          navigate('dashboard');
        } catch (error) {
          output.value = `Import failed: ${error.message}`;
        }
      });
      importInput.dataset.bound = 'true';
    }

    if (!wipeBtn.dataset.bound) {
      wipeBtn.addEventListener('click', async () => {
        if (!window.confirm('This will remove all local finance data. Continue?')) return;
        await FFDB.clearAll();
        state.categories = [...DEFAULT_CATEGORIES];
        state.currency = 'EUR';
        refreshFormatter();
        await FFDB.setSetting('categories', state.categories);
        await FFDB.setSetting('currency', state.currency);
        await updateNetWorthStatus();
        refreshCategoryInputs();
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
    const [assets, liabilities] = await Promise.all([
      FFDB.getAll('assets'),
      FFDB.getAll('liabilities')
    ]);
    const totalAssets = sum(assets.map((asset) => Number(asset.value) || 0));
    const totalLiabilities = sum(liabilities.map((item) => Number(item.value) || 0));
    const net = totalAssets - totalLiabilities;
    if (statusEl) {
      statusEl.textContent = `Net worth: ${money(net)}`;
    }
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
