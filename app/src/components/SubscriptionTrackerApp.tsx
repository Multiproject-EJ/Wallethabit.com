import { useEffect, useMemo, useState } from 'react'

import '../styles/subscription-tracker.css'

type Frequency = 'Monthly' | 'Yearly' | 'Weekly' | 'Quarterly'

type SubscriptionRecord = {
  id: string
  name: string
  category: string
  amount: number
  currency: string
  freq: Frequency
  nextBillDate: string
  payment: string
  notes: string
  logoUrl?: string
  website?: string
}

type SortConfig = {
  key: keyof Pick<SubscriptionRecord, 'name' | 'category' | 'amount' | 'nextBillDate'> | 'monthly'
  dir: 'asc' | 'desc'
}

type Settings = {
  currency: string
  leadDays: number
  theme: 'theme-graphite' | 'theme-light'
  categories: string[]
  timezone: string
}

type PanelDraft = {
  id?: string
  name: string
  category: string
  amount: string
  freq: Frequency
  nextBillDate: string
  payment: string
  notes: string
  website: string
  logoUrl: string
}

type PanelState = {
  mode: 'add' | 'edit'
  open: boolean
  draft: PanelDraft
}

const STORAGE_KEY = 'wallethabit.subscription-tracker.v1'

const initialSettings: Settings = {
  currency: '$',
  leadDays: 30,
  theme: 'theme-graphite',
  categories: ['Streaming', 'Productivity', 'Design', 'Music', 'Shopping'],
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}

const demoSubscriptions: SubscriptionRecord[] = [
  {
    id: 's1',
    name: 'iCloud 2TB',
    category: 'Cloud',
    amount: 9.99,
    currency: '$',
    freq: 'Monthly',
    nextBillDate: toISO(offsetDays(-2)),
    payment: 'Apple Pay',
    notes: 'Family storage plan',
    logoUrl: 'https://logo.clearbit.com/apple.com',
    website: 'https://www.icloud.com',
  },
  {
    id: 's2',
    name: 'Adobe Creative Cloud',
    category: 'Productivity',
    amount: 59.99,
    currency: '$',
    freq: 'Monthly',
    nextBillDate: toISO(offsetDays(-1)),
    payment: 'Visa •••• 1234',
    notes: 'All Apps bundle',
    logoUrl: 'https://logo.clearbit.com/adobe.com',
    website: 'https://www.adobe.com',
  },
  {
    id: 's3',
    name: 'Notion',
    category: 'Productivity',
    amount: 10,
    currency: '$',
    freq: 'Monthly',
    nextBillDate: toISO(offsetDays(0)),
    payment: 'Visa •••• 1234',
    notes: 'Workspace Plus plan',
    logoUrl: 'https://logo.clearbit.com/notion.so',
    website: 'https://www.notion.so',
  },
  {
    id: 's4',
    name: 'Spotify',
    category: 'Music',
    amount: 9.99,
    currency: '$',
    freq: 'Monthly',
    nextBillDate: toISO(offsetDays(1)),
    payment: 'Amex •••• 3005',
    notes: 'Family account',
    logoUrl: 'https://logo.clearbit.com/spotify.com',
    website: 'https://www.spotify.com',
  },
  {
    id: 's5',
    name: 'Netflix',
    category: 'Streaming',
    amount: 15.99,
    currency: '$',
    freq: 'Monthly',
    nextBillDate: toISO(offsetDays(9)),
    payment: 'Visa •••• 1234',
    notes: 'Standard plan',
    logoUrl: 'https://logo.clearbit.com/netflix.com',
    website: 'https://www.netflix.com',
  },
  {
    id: 's6',
    name: 'Canva Pro',
    category: 'Design',
    amount: 12.99,
    currency: '$',
    freq: 'Monthly',
    nextBillDate: toISO(offsetDays(15)),
    payment: 'Visa •••• 1234',
    notes: 'Brand kit and templates',
    logoUrl: 'https://logo.clearbit.com/canva.com',
    website: 'https://www.canva.com',
  },
  {
    id: 's7',
    name: 'Amazon Prime',
    category: 'Shopping',
    amount: 139,
    currency: '$',
    freq: 'Yearly',
    nextBillDate: toISO(offsetDays(26)),
    payment: 'Mastercard •••• 7788',
    notes: 'Annual renewal',
    logoUrl: 'https://logo.clearbit.com/amazon.com',
    website: 'https://www.amazon.com/prime',
  },
]

type PersistedPayload = {
  settings: Settings
  subscriptions: SubscriptionRecord[]
  sort: SortConfig
}

function offsetDays(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

function toISO(date: Date) {
  return date.toISOString().split('T')[0] ?? ''
}

function monthlyFrom(amount: number, freq: Frequency) {
  if (freq === 'Yearly') return amount / 12
  if (freq === 'Weekly') return (amount * 52) / 12
  if (freq === 'Quarterly') return amount / 3
  return amount
}

function formatMoney(amount: number, currency: string) {
  return `${currency}${amount.toFixed(2)}`
}

function daysUntil(date: string | undefined) {
  if (!date) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  if (Number.isNaN(target.getTime())) return null
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000)
  return diff
}

function emptyDraft(): PanelDraft {
  return {
    name: '',
    category: '',
    amount: '',
    freq: 'Monthly',
    nextBillDate: '',
    payment: '',
    notes: '',
    website: '',
    logoUrl: '',
  }
}

export function SubscriptionTrackerApp() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([])
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [query, setQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [sort, setSort] = useState<SortConfig>({ key: 'nextBillDate', dir: 'asc' })
  const [panel, setPanel] = useState<PanelState>({ mode: 'add', open: false, draft: emptyDraft() })
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      setSubscriptions(demoSubscriptions)
      return
    }
    try {
      const parsed = JSON.parse(raw) as PersistedPayload
      setSubscriptions(parsed.subscriptions ?? demoSubscriptions)
      setSettings({ ...initialSettings, ...(parsed.settings ?? {}) })
      setSort(parsed.sort ?? { key: 'nextBillDate', dir: 'asc' })
      if (parsed.settings?.currency) {
        setSubscriptions((prev) => prev.map((item) => ({ ...item, currency: parsed.settings?.currency ?? item.currency })))
      }
    } catch (err) {
      console.error('Failed to restore subscription tracker state', err)
      setSubscriptions(demoSubscriptions)
    }
  }, [])

  useEffect(() => {
    const payload: PersistedPayload = { settings, subscriptions, sort }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [settings, subscriptions, sort])

  const derived = useMemo(() => {
    const normalized = subscriptions.map((item) => ({
      ...item,
      monthly: monthlyFrom(item.amount, item.freq),
    }))

    const categories = Array.from(
      new Set([
        'All',
        ...settings.categories,
        ...normalized.map((item) => (item.category ? item.category : 'Unsorted')),
      ]),
    )

    const lowerQuery = query.trim().toLowerCase()

    let filtered = normalized

    if (filterCategory !== 'All') {
      filtered = filtered.filter((item) => (item.category || 'Unsorted').toLowerCase() === filterCategory.toLowerCase())
    }

    if (lowerQuery) {
      filtered = filtered.filter((item) =>
        [item.name, item.category, item.payment, item.notes]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(lowerQuery)),
      )
    }

    const sorted = [...filtered].sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1
      switch (sort.key) {
        case 'name':
        case 'category':
          return a[sort.key].localeCompare(b[sort.key]) * dir
        case 'amount':
          return (a.amount - b.amount) * dir
        case 'monthly':
          return (a.monthly - b.monthly) * dir
        case 'nextBillDate':
        default: {
          const aTime = new Date(a.nextBillDate ?? '').getTime()
          const bTime = new Date(b.nextBillDate ?? '').getTime()
          return (aTime - bTime) * dir
        }
      }
    })

    const monthlyTotal = sorted.reduce((acc, item) => acc + item.monthly, 0)

    return {
      categories,
      list: sorted,
      monthlyTotal,
      annualTotal: monthlyTotal * 12,
    }
  }, [subscriptions, settings.categories, query, filterCategory, sort])

  function openPanel(mode: PanelState['mode'], existing?: SubscriptionRecord) {
    if (mode === 'edit' && existing) {
      setPanel({
        mode,
        open: true,
        draft: {
          id: existing.id,
          name: existing.name,
          category: existing.category,
          amount: existing.amount.toString(),
          freq: existing.freq,
          nextBillDate: existing.nextBillDate,
          payment: existing.payment,
          notes: existing.notes,
          website: existing.website ?? '',
          logoUrl: existing.logoUrl ?? '',
        },
      })
      return
    }

    setPanel({ mode, open: true, draft: emptyDraft() })
  }

  function closePanel() {
    setPanel((prev) => ({ ...prev, open: false }))
  }

  function handleDraftChange<K extends keyof PanelDraft>(key: K, value: PanelDraft[K]) {
    setPanel((prev) => ({ ...prev, draft: { ...prev.draft, [key]: value } }))
  }

  function handleSave() {
    const amountNumber = Number.parseFloat(panel.draft.amount || '0')
    if (!panel.draft.name.trim()) {
      return
    }
    const payload: SubscriptionRecord = {
      id: panel.draft.id ?? `sub-${Date.now()}`,
      name: panel.draft.name.trim(),
      category: panel.draft.category.trim(),
      amount: Number.isFinite(amountNumber) ? Math.max(amountNumber, 0) : 0,
      currency: settings.currency,
      freq: panel.draft.freq,
      nextBillDate: panel.draft.nextBillDate,
      payment: panel.draft.payment.trim(),
      notes: panel.draft.notes.trim(),
      website: panel.draft.website.trim() || undefined,
      logoUrl: panel.draft.logoUrl.trim() || undefined,
    }

    setSubscriptions((prev) => {
      if (panel.mode === 'edit') {
        return prev.map((item) => (item.id === payload.id ? { ...payload } : item))
      }
      return [...prev, payload]
    })
    closePanel()
  }

  function handleDelete(id: string | undefined) {
    if (!id) return
    setSubscriptions((prev) => prev.filter((item) => item.id !== id))
    closePanel()
  }

  function handleHeaderSort(key: SortConfig['key']) {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      }
      return { key, dir: 'asc' }
    })
  }

  function handleSuggestLogo() {
    const domain = panel.draft.website.trim().replace(/^https?:\/\//, '').split('/')[0]
    if (!domain) return
    handleDraftChange('logoUrl', `https://logo.clearbit.com/${domain}`)
  }

  function handleLoadDemo() {
    setSubscriptions(
      demoSubscriptions.map((item) => ({
        ...item,
        currency: settings.currency,
      })),
    )
  }

  function handleClearAll() {
    setSubscriptions([])
  }

  const panelTitle = panel.mode === 'edit' ? 'Edit subscription' : 'Add subscription'

  return (
    <div className={`subscription-app ${settings.theme}`}>
      <div className="subscription-app__wrap">
        <div className="subscription-app__header">
          <div className="subscription-app__brand">
            <div className="subscription-app__logo" aria-hidden="true" />
            <div>
              <div className="subscription-app__title">Subscription Tracker</div>
              <div className="subscription-app__muted">All your recurring costs in one place</div>
            </div>
          </div>
          <div className="subscription-app__actions">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="subscription-app__input"
              placeholder="Search name, tag, payment…"
              aria-label="Search subscriptions"
            />
            <button type="button" className="subscription-app__btn subscription-app__btn--ghost" onClick={handleLoadDemo}>
              Reload
            </button>
            <button type="button" className="subscription-app__btn" onClick={() => openPanel('add')}>
              Add subscription
            </button>
          </div>
        </div>

        <div className="subscription-app__grid">
          <div className="subscription-app__card subscription-app__pad subscription-app__span-4">
            <div className="subscription-app__kpi">
              <div className="label">Monthly total</div>
              <div className="value">{formatMoney(derived.monthlyTotal, settings.currency)}</div>
              <div className="sub">Prorated from mixes</div>
            </div>
          </div>
          <div className="subscription-app__card subscription-app__pad subscription-app__span-4">
            <div className="subscription-app__kpi">
              <div className="label">Annual total</div>
              <div className="value">{formatMoney(derived.annualTotal, settings.currency)}</div>
              <div className="sub">Computed ×12</div>
            </div>
          </div>
          <div
            className="subscription-app__card subscription-app__pad subscription-app__span-4 subscription-app__cta"
            role="button"
            tabIndex={0}
            onClick={() => setShowSettings(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setShowSettings(true)
              }
            }}
          >
            <div className="subscription-app__kpi">
              <div className="label">Preferences</div>
              <div className="value">
                <span>Open settings</span>
                <span className="arrow" aria-hidden>
                  →
                </span>
              </div>
              <div className="sub">Currency, categories, appearance</div>
            </div>
          </div>
        </div>

        <div className="subscription-app__spacer" />

        <div className="subscription-app__card subscription-app__pad">
          <div className="subscription-app__chips" role="tablist" aria-label="Filter by category">
            {derived.categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`subscription-app__chip${filterCategory === category ? ' subscription-app__chip--active' : ''}`}
                onClick={() => setFilterCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="subscription-app__spacer" />

        <div className="subscription-app__card subscription-app__table-card">
          <table className="subscription-app__table">
            <thead>
              <tr>
                {renderHeader('Service', 'name')}
                <th>Logo</th>
                {renderHeader('Category', 'category')}
                {renderHeader('Price', 'amount')}
                <th>Freq</th>
                {renderHeader('Monthly', 'monthly')}
                {renderHeader('Next bill', 'nextBillDate')}
                <th>Pay method</th>
                <th style={{ width: 80 }} aria-hidden>
                  &nbsp;
                </th>
              </tr>
            </thead>
            <tbody>
              {derived.list.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="subscription-app__empty">
                      <span>No subscriptions yet.</span>
                      <div className="subscription-app__empty-actions">
                        <button type="button" className="subscription-app__btn" onClick={handleLoadDemo}>
                          Load demo data
                        </button>
                        <button
                          type="button"
                          className="subscription-app__btn subscription-app__btn--ghost"
                          onClick={handleClearAll}
                        >
                          Clear list
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                derived.list.map((item) => {
                  const du = daysUntil(item.nextBillDate)
                  let dueLabel = '—'
                  let dueClass = 'due-ok'
                  if (du === 0) {
                    dueLabel = 'today'
                    dueClass = 'due-today'
                  } else if (du !== null && du < 0) {
                    dueLabel = `${Math.abs(du)}d overdue`
                    dueClass = 'due-today'
                  } else if (du !== null) {
                    dueLabel = `${du}d`
                    dueClass = du <= settings.leadDays ? 'due-soon' : 'due-ok'
                  }

                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        {item.notes ? <div className="subscription-app__muted subscription-app__note">{item.notes}</div> : null}
                      </td>
                      <td>
                        {item.logoUrl ? (
                          <img
                            className="subscription-app__logo-img"
                            src={item.logoUrl}
                            alt=""
                            onError={(event) => {
                              event.currentTarget.style.opacity = '0.2'
                            }}
                          />
                        ) : (
                          <div className="subscription-app__logo-img" aria-hidden />
                        )}
                      </td>
                      <td>
                        <span className="subscription-app__pill">{item.category || '—'}</span>
                      </td>
                      <td>{formatMoney(item.amount, settings.currency)}</td>
                      <td>{item.freq}</td>
                      <td>{formatMoney(item.monthly, settings.currency)}</td>
                      <td>
                        <span className={`subscription-app__due-badge ${dueClass}`}>
                          {item.nextBillDate || '—'} {dueLabel ? `(${dueLabel})` : ''}
                        </span>
                      </td>
                      <td>{item.payment || '—'}</td>
                      <td>
                        <button
                          type="button"
                          className="subscription-app__btn subscription-app__btn--ghost"
                          onClick={() => openPanel('edit', item)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="subscription-app__footer">
          <div>
            Tip: <span className="subscription-app__pill">F</span> search • <span className="subscription-app__pill">N</span> add
            new
          </div>
          <div>
            v0.4.3 ·{' '}
            <button type="button" className="subscription-app__link" onClick={() => setShowSettings(true)}>
              Settings
            </button>
          </div>
        </div>
      </div>

      <div
        className={`subscription-app__overlay${panel.open ? ' show' : ''}`}
        role="presentation"
        onClick={closePanel}
      />

      <aside className={`subscription-app__panel${panel.open ? ' show' : ''}`} aria-hidden={!panel.open}>
        <h3>{panelTitle}</h3>
        <form
          className="subscription-app__form"
          onSubmit={(event) => {
            event.preventDefault()
            handleSave()
          }}
        >
          <div className="subscription-app__cols">
            <div className="subscription-app__row">
              <label htmlFor="sub-name">Name</label>
              <input
                id="sub-name"
                className="subscription-app__input"
                value={panel.draft.name}
                onChange={(event) => handleDraftChange('name', event.target.value)}
                required
                placeholder="Netflix, Spotify, Adobe…"
              />
            </div>
            <div className="subscription-app__row">
              <label htmlFor="sub-category">Category</label>
              <input
                id="sub-category"
                className="subscription-app__input"
                value={panel.draft.category}
                onChange={(event) => handleDraftChange('category', event.target.value)}
                placeholder="Streaming, Productivity…"
              />
            </div>
          </div>

          <div className="subscription-app__cols">
            <div className="subscription-app__row">
              <label htmlFor="sub-payment">Payment method</label>
              <input
                id="sub-payment"
                className="subscription-app__input"
                value={panel.draft.payment}
                onChange={(event) => handleDraftChange('payment', event.target.value)}
                placeholder="Visa •••• 1234, PayPal…"
              />
            </div>
            <div className="subscription-app__row">
              <label htmlFor="sub-amount">Amount</label>
              <input
                id="sub-amount"
                type="number"
                min={0}
                step={0.01}
                className="subscription-app__input"
                value={panel.draft.amount}
                onChange={(event) => handleDraftChange('amount', event.target.value)}
                placeholder="9.99"
              />
            </div>
          </div>

          <div className="subscription-app__cols">
            <div className="subscription-app__row">
              <label htmlFor="sub-frequency">Frequency</label>
              <select
                id="sub-frequency"
                className="subscription-app__select"
                value={panel.draft.freq}
                onChange={(event) => handleDraftChange('freq', event.target.value as Frequency)}
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Weekly">Weekly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>
            <div className="subscription-app__row">
              <label htmlFor="sub-next-bill">Next billing date</label>
              <input
                id="sub-next-bill"
                type="date"
                className="subscription-app__input"
                value={panel.draft.nextBillDate}
                onChange={(event) => handleDraftChange('nextBillDate', event.target.value)}
              />
            </div>
          </div>

          <div className="subscription-app__cols">
            <div className="subscription-app__row">
              <label htmlFor="sub-website">
                Website <span className="subscription-app__hint">(optional)</span>
              </label>
              <input
                id="sub-website"
                className="subscription-app__input"
                value={panel.draft.website}
                onChange={(event) => handleDraftChange('website', event.target.value)}
                placeholder="https://www.netflix.com"
              />
            </div>
            <div className="subscription-app__row">
              <label htmlFor="sub-logo">
                Logo URL <span className="subscription-app__hint">(or suggest)</span>
              </label>
              <div className="subscription-app__logo-input">
                <input
                  id="sub-logo"
                  className="subscription-app__input"
                  value={panel.draft.logoUrl}
                  onChange={(event) => handleDraftChange('logoUrl', event.target.value)}
                  placeholder="https://…/logo.png"
                />
                <button
                  type="button"
                  className="subscription-app__btn subscription-app__btn--ghost"
                  onClick={handleSuggestLogo}
                >
                  Suggest
                </button>
              </div>
            </div>
          </div>

          <div className="subscription-app__row">
            <label htmlFor="sub-notes">Notes</label>
            <textarea
              id="sub-notes"
              className="subscription-app__input"
              rows={3}
              value={panel.draft.notes}
              onChange={(event) => handleDraftChange('notes', event.target.value)}
              placeholder="Student plan, 2 screens…"
            />
          </div>

          <div className="subscription-app__panel-actions">
            <button type="submit" className="subscription-app__btn subscription-app__btn--ok">
              Save
            </button>
            <button
              type="button"
              className="subscription-app__btn subscription-app__btn--ghost"
              onClick={closePanel}
            >
              Cancel
            </button>
            {panel.mode === 'edit' ? (
              <button
                type="button"
                className="subscription-app__btn subscription-app__btn--danger"
                onClick={() => handleDelete(panel.draft.id)}
              >
                Delete
              </button>
            ) : null}
          </div>
        </form>
      </aside>

      <div className={`subscription-app__modal${showSettings ? ' show' : ''}`} role="dialog" aria-modal={showSettings}>
        <div className="subscription-app__modal-card" role="document">
          <div className="subscription-app__modal-head">
            <div className="subscription-app__modal-title">Settings</div>
            <div className="subscription-app__modal-actions">
              <button
                type="button"
                className="subscription-app__btn subscription-app__btn--ghost"
                onClick={() => setShowSettings(false)}
              >
                Close
              </button>
            </div>
          </div>
          <div className="subscription-app__modal-body">
            <div className="subscription-app__settings-grid">
              <label className="subscription-app__row">
                Currency symbol
                <input
                  className="subscription-app__input"
                  value={settings.currency}
                  onChange={(event) => setSettings((prev) => ({ ...prev, currency: event.target.value || '$' }))}
                  placeholder="$"
                />
                <span className="subscription-app__hint">Shown before amounts (e.g., $, €, £, NOK).</span>
              </label>
              <label className="subscription-app__row">
                Reminder lead days
                <input
                  type="number"
                  min={0}
                  className="subscription-app__input"
                  value={settings.leadDays}
                  onChange={(event) =>
                    setSettings((prev) => ({ ...prev, leadDays: Math.max(0, Number(event.target.value) || 0) }))
                  }
                  placeholder="7"
                />
                <span className="subscription-app__hint">Days before next bill to include in “Due soon”.</span>
              </label>
              <label className="subscription-app__row">
                Theme
                <select
                  className="subscription-app__select"
                  value={settings.theme}
                  onChange={(event) => setSettings((prev) => ({ ...prev, theme: event.target.value as Settings['theme'] }))}
                >
                  <option value="theme-graphite">Graphite</option>
                  <option value="theme-light">Light</option>
                </select>
                <span className="subscription-app__hint">Applies instantly and saves for next time.</span>
              </label>
              <label className="subscription-app__row">
                Timezone
                <input
                  className="subscription-app__input"
                  value={settings.timezone}
                  onChange={(event) => setSettings((prev) => ({ ...prev, timezone: event.target.value }))}
                  placeholder="America/New_York"
                />
                <span className="subscription-app__hint">Used to format dates locally.</span>
              </label>
              <label className="subscription-app__row subscription-app__row--full">
                Categories (comma separated)
                <textarea
                  className="subscription-app__input"
                  rows={2}
                  value={settings.categories.join(', ')}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      categories: event.target.value
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="Streaming, Productivity, Cloud"
                />
                <span className="subscription-app__hint">Shown as chips + in the category picker.</span>
              </label>
            </div>
          </div>
          <div className="subscription-app__modal-actions subscription-app__modal-actions--footer">
            <button
              type="button"
              className="subscription-app__btn subscription-app__btn--ghost"
              onClick={() => setShowSettings(false)}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  function renderHeader(label: string, key: SortConfig['key']) {
    const active = sort.key === key
    const arrow = active ? (sort.dir === 'asc' ? '▲' : '▼') : ''
    return (
      <th
        className={`subscription-app__sort${active ? ' active' : ''}`}
        data-arrow={arrow}
        onClick={() => handleHeaderSort(key)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleHeaderSort(key)
          }
        }}
      >
        {label}
      </th>
    )
  }
}

