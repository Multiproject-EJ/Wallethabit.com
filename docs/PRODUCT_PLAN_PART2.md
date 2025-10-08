# Modular Personal Finance Suite — Technical Spec & Build Blueprint (Part 2 of 2)

> **Document purpose.** Translate the Part 1 vision into implementation-ready guidance for the Modular Personal Finance Suite MVP and successive phases.

> **Maintenance guidance.** Preserve section numbering, document rationale near decisions, and log structural changes in the changelog so Codex can track architectural evolution quickly.

**Document Changelog**
- 2024-XX-XX — Initial technical scaffolding drafted.
- 2024-XX-XX — _Add future edits here._

**Quick Navigation**
0. [High-Level Architecture](#0-high-level-architecture)
1. [Repos & Folders](#1-repos--folders)
2. [Packages & Scaffolding](#2-packages--scaffolding)
3. [Environment Variables](#3-environment-variables)
4. [Data Model (ERD – text)](#4-data-model-erd--text)
5. [Supabase: Core Migrations](#5-supabase-core-migrations-outline)
6. [Access Control & Feature Flags](#6-access-control--feature-flags)
7. [Edge Functions](#7-edge-functions-api-contracts)
8. [Frontend Routing Map](#8-frontend-routing-map)
9. [Core UI Components](#9-core-ui-components-mvp-stubs)
10. [Theme / Personalization / i18n](#10-theme--personalization--i18n)
11. [MVP Data Flows](#11-mvp-data-flows)
12. [Payments & Plans](#12-payments--plans)
13. [AI Advisor Prompts](#13-ai-advisor-prompts-outline)
14. [Testing Strategy](#14-testing-strategy)
15. [Telemetry & Analytics](#15-telemetry--analytics)
16. [Accessibility](#16-accessibility)
17. [Acceptance Criteria (MVP, Phase 1)](#17-acceptance-criteria-mvp-phase-1)
18. [Phase 2–4 Acceptance Highlights](#18-phase-24-acceptance-highlights)
19. [Backlog Priorities](#19-backlog-prioritized-must-have--nice-to-have)
20. [Developer Runbook](#20-developer-runbook-quick-start)
21. [UX Flows](#21-ux-flows-short)

---

This document extends the product plan with implementation-ready technical guidance for the Modular Personal Finance Suite MVP and its future phases.

## 0. High-Level Architecture
- **Client:** React (Vite) + TypeScript, React Router, Context for auth/theme, Chart.js for charts.
- **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions).
- **Payments:** Stripe (Checkout + Webhooks).
- **Bank Sync (optional):** Plaid (link + transactions sync).
- **AI (premium):** Edge Function calling OpenAI (monthly report, what-ifs).
- **Infra:** ENV via `.env` (client) + Supabase project secrets (server).
- **Security:** RLS on all user data, JWT from Supabase Auth, HTTPS only.

## 1. Repos & Folders
```
finance-suite/
├─ app/                      # React app (Vite)
│  ├─ src/
│  │  ├─ components/         # Generic UI pieces
│  │  ├─ modules/            # Feature modules (isolated)
│  │  │  ├─ budget/
│  │  │  ├─ debts/
│  │  │  ├─ investments/
│  │  │  ├─ savings/
│  │  │  ├─ realestate/
│  │  │  ├─ insurance/
│  │  │  ├─ taxes/
│  │  │  ├─ income/
│  │  │  ├─ retire/
│  │  │  └─ ai/
│  │  ├─ pages/              # Route pages (Dashboard, Settings, Modules)
│  │  ├─ services/           # supabase, stripe, plaid, ai wrappers
│  │  ├─ context/            # AuthContext, ThemeContext, ModulesContext
│  │  ├─ hooks/
│  │  ├─ styles/
│  │  ├─ i18n/
│  │  ├─ App.tsx
│  │  └─ main.tsx
│  └─ index.html
│
├─ supabase/                 # DB schema, policies, functions
│  ├─ migrations/            # SQL migrations
│  ├─ policies/              # RLS policies (SQL)
│  └─ functions/
│     ├─ stripe-webhook/     # Edge Function
│     ├─ plaid-webhook/
│     └─ ai-generate-report/
│
├─ docs/                     # ADRs, ERD text, API contracts, runbooks
└─ .env.example
```

## 2. Packages & Scaffolding
**Frontend (Vite + React + TS):**
```
npm create vite@latest app -- --template react-ts
cd app
npm i @supabase/supabase-js react-router-dom chart.js react-chartjs-2 zod dayjs clsx
npm i -D tailwindcss postcss autoprefixer eslint @types/node @types/react @types/react-dom
npx tailwindcss init -p
```

**Edge Functions & Tooling:**
```
npm i -g supabase
supabase init
# later: supabase functions new stripe-webhook
```

## 3. Environment Variables
`.env.example` (root or `app/.env` for client vars prefixed with `VITE_`)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

VITE_STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox|development|production

OPENAI_API_KEY=

APP_BASE_URL=https://yourdomain.com
```

## 4. Data Model (ERD – text)
- **profiles:** `id` (uuid pk, = auth.user), `created_at`, `display_name`, `currency_code`, `theme`, `locale`, `onboarding_step`.
- **modules_enabled:** `id`, `user_id` fk, `module_key` (enum: `budget|debts|investments|savings|income|realestate|insurance|taxes|retire|ai`), `enabled` boolean, `created_at`.
- **accounts:** `id`, `user_id` fk, `name`, `type` (`cash|checking|credit|investment|loan|asset|other`), `institution`, `currency`, `balance_current` numeric, `balance_updated_at`, `plaid_item_id?`, `external_id?`, `created_at`.
- **transactions:** `id`, `user_id` fk, `account_id` fk, `date`, `payee`, `amount` numeric (pos=income, neg=expense), `category_id` fk?, `memo`, `is_recurring` boolean, `recurrence_rule?`, `source` (`manual|csv|plaid`), `created_at`.
- **categories:** `id`, `user_id` fk, `name`, `type` (`expense|income`), `parent_id?`.
- **budgets:** `id`, `user_id` fk, `category_id` fk, `period` (`YYYY-MM`), `amount_planned` numeric, `amount_actual` numeric (materialized or view), `created_at`.
- **debts:** `id`, `user_id` fk, `name`, `principal` numeric, `rate_apr` numeric, `min_payment` numeric, `due_day` int, `type` (`credit|student|mortgage|auto|personal|other`), `created_at`.
- **debt_payments:** `id`, `debt_id` fk, `date`, `amount`, `principal_applied`, `interest_applied`.
- **assets:** `id`, `user_id` fk, `name`, `class` (`stock|etf|crypto|property|vehicle|collectible|other`), `quantity` numeric, `unit_cost` numeric, `current_price` numeric, `valuation_source` (`manual|api`), `account_id?`, `created_at`.
- **goals:** `id`, `user_id` fk, `name`, `target_amount` numeric, `target_date`, `category` (`emergency|downpayment|vacation|debt|other`), `allocated_rules` jsonb?, `created_at`.
- **insights:** `id`, `user_id` fk, `type` (`alert|tip|ai_report|milestone`), `title`, `body`, `meta` jsonb, `created_at`, `read_at?`.
- **subscriptions:** `id`, `user_id` fk, `stripe_customer_id`, `stripe_price_id`, `status` (`trialing|active|past_due|canceled|incomplete`), `current_period_end`.
- **asset_txns (optional):** `id`, `asset_id` fk, `date`, `type` (`buy|sell|dividend|split`), `qty`, `price`, `fees`, `note`.

## 5. Supabase: Core Migrations (Outline)
- `migrations/0001_init.sql`
  - Create tables above.
  - Add indexes: `(user_id)`, `(date)`, `(period)`, `(category_id)`.
  - Enable RLS: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
  - Policies (example pattern):
    ```sql
    CREATE POLICY "user_can_select_own"
    ON public.accounts
    FOR SELECT
    USING (auth.uid() = user_id);

    CREATE POLICY "user_can_insert_own"
    ON public.accounts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "user_can_update_own"
    ON public.accounts
    FOR UPDATE
    USING (auth.uid() = user_id);

    CREATE POLICY "user_can_delete_own"
    ON public.accounts
    FOR DELETE
    USING (auth.uid() = user_id);
    ```
- **Views / Materialized Views**
  - `vw_net_worth_monthly` (`user_id`, `month`, `assets_total`, `debts_total`, `net_worth`).
  - `vw_budget_actuals` (`user_id`, `period`, `category_id`, `amount_actual`).
  - Refresh on cron or via trigger after transaction insert/update.

## 6. Access Control & Feature Flags
- `modules_enabled` drives UI and API gating.
- Edge Functions enforce subscription checks for premium endpoints (AI, Plaid sync if paywalled, investments live quotes).
- Client shows “Upgrade” CTA if module disabled or premium locked.

## 7. Edge Functions (API Contracts)
- **stripe-webhook**
  - Purpose: Handle `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
  - Input: Stripe webhook event.
  - Process: Upsert `subscriptions` row for `user_id`, set status, `current_period_end`, map to `price_id`.
  - Output: `200 OK`.
- **plaid-webhook (optional)**
  - Purpose: Receive transaction updates; enqueue fetch job.
  - Input: Plaid webhook payload.
  - Process: Fetch new transactions → upsert into `transactions`, update `accounts.balance_current`.
  - Output: `200 OK`.
- **ai-generate-report (premium)**
  - Purpose: Create monthly natural-language summary.
  - Auth: Verify JWT; verify `subscriptions.status='active'` OR feature unlocked.
  - Input: `{ month: 'YYYY-MM' }`.
  - Process (high-level):
    1. Query sums by category, delta vs prior month, net worth change, debt progress, goals progress.
    2. Build prompt with bullet metrics.
    3. Call OpenAI; store in `insights` (`type='ai_report'`).
  - Output: `{ insightId, title, body }`.
- **investments-prices-refresh (premium or metered)**
  - Purpose: Refresh quotes for assets with `valuation_source='api'`.
  - Input: none (server-side scheduled) or `{ tickers: [] }`.
  - Output: Count updated.

## 8. Frontend Routing Map
- `/` → `<DashboardPage/>`
- `/auth` → `<AuthPage/>`
- `/modules` → `<ModulesGallery/>`
- `/budget` → `<BudgetPage/>`
- `/debts` → `<DebtsPage/>`
- `/investments` → `<InvestmentsPage/>`
- `/savings` → `<SavingsPage/>`
- `/income` → `<IncomePage/>`
- `/realestate` → `<RealEstatePage/>`
- `/insurance` → `<InsurancePage/>`
- `/taxes` → `<TaxesPage/>`
- `/retire` → `<RetirePage/>`
- `/ai` → `<AIAdvisorPage/>`
- `/settings` → `<SettingsPage/>`

## 9. Core UI Components (MVP Stubs)
- Dashboard widgets
- `NetWorthChart.tsx`
- `CashFlowHeatmap.tsx`
- `BudgetCard.tsx`
- `GoalsCard.tsx`
- `InsightsFeed.tsx`
- `QuickActions.tsx`
- Shared components: `Navbar.tsx`, `Sidebar.tsx`, `ThemeToggle.tsx`, `UpgradeBadge.tsx`
- Utility components: `DataTable.tsx`, `Modal.tsx`, `FormField.tsx`, `MoneyInput.tsx`
- Forms: `AddTransactionForm.tsx`, `AddAccountForm.tsx`, `AddGoalForm.tsx`
- Chart wrappers: `LineChart.tsx`, `BarChart.tsx`, `PieChart.tsx`

## 10. Theme / Personalization / i18n
- `ThemeContext`: `theme: 'light'|'dark'`, `accent: 'teal'|'indigo'|'emerald'|...` (stored in `profiles`).
- Tailwind CSS with CSS variables for accent; user-selectable presets.
- `i18n/` directory with `en.json` baseline; `useLocale()` hook; currency/number formatting via `Intl.NumberFormat` based on `profiles.currency_code` & `locale`.

## 11. MVP Data Flows
- **Add Transaction**
  - UI: `AddTransactionForm` → validate (zod) → `supabase.from('transactions').insert`.
  - Post-insert: Optimistically update Budget actuals; toast confirmation; refresh dashboard widgets.
- **Budget Month Close (wizard)**
  - Compute actuals per category from transactions.
  - Show deltas vs `budgets.amount_planned`.
  - Offer carryover rules (optional); write next month’s budgets.
- **Net Worth**
  - Query `accounts.balance_current` + derived debt balances (or from accounts typed as loan); add assets valuations → chart by month from `vw_net_worth_monthly`.

## 12. Payments & Plans
- **Stripe Products/Prices**
  - `pro_month` (all premium modules + AI), monthly.
  - `pro_year` (same), yearly (≈ 2 months free).
  - Optional: `addon_investments`, `addon_ai` as one-time unlocks (or separate recurring if needed).
- **Client Flow**
  - Press “Upgrade” → call backend to create Checkout session → redirect URL.
  - On success: webhook updates `subscriptions`; client queries `subscriptions.status` to unlock.

## 13. AI Advisor Prompts (Outline)
- **Monthly Report Prompt (system)**
  - Role: “You are a supportive personal finance coach. Be concise, friendly, and actionable. Use simple language. Celebrate wins, suggest 1–3 specific next steps.”
- **User data (context)**
  - Month aggregates: income total, expense total by top categories, net worth delta, debt delta, savings goal progress, notable anomalies.
  - Prior month comparison deltas.
- **Instruction (assistant)**
  - Generate: title, 3–5 bullet highlights, 2–3 action suggestions, one encouraging closing line.
- **What-If**
  - Input: scenario changes (e.g., +$X income, -$Y expense, one-time purchase).
  - Output: projected monthly surplus/deficit change, net worth trajectory impact, goal ETA shift, 1 suggestion.

## 14. Testing Strategy
- **Unit (Vitest):** money math, budget rollups, payoff simulator math, date utils.
- **Component tests (React Testing Library):** forms validate + submit; dashboard renders with mock data.
- **E2E (Playwright/Cypress):** sign up, add account, add transaction, see dashboard update; upgrade flow happy path.
- **Contract tests:** Edge function inputs/outputs (supertest against local emulator).

## 15. Telemetry & Analytics
- Minimal privacy-respecting analytics: page views, feature use (module toggles), upgrade funnel events.
- Error logging: console → Sentry (capture function errors + client JS).
- Feature metrics: daily active users, retention cohort by module adopted, conversion to paid.

## 16. Accessibility
- WCAG AA color contrast; focus states; keyboard navigation.
- Charts: alt summaries; table equivalents for key insights.
- Font size scaling; reduced motion preference honored.

## 17. Acceptance Criteria (MVP, Phase 1)
- Auth: Sign up/login/out; profile persisted; theme stored and applied.
- Dashboard: Shows at least 3 widgets (Net Worth line with mock/net values, Budget overview for current month, Insights list).
- Budget Module: Create categories, add/edit/delete transactions, see category totals and planned vs actual for current month.
- RLS: User A cannot read/write User B data (verified via API tests).
- Performance: Dashboard initial load < 1.5s on mid-tier mobile over 4G (with minimal data).
- UX: Mobile add-transaction ≤ 3 taps; empty states guide setup.

## 18. Phase 2–4 Acceptance Highlights
- **Phase 2**
  - CSV import maps columns → transactions; recurring transactions + reminders; basic Debts with payoff path & projected “debt-free by” date.
- **Phase 3**
  - Investments: add holdings, price refresh (manual or scheduled), allocation pie; Savings Goals creation + progress; basic alerts.
- **Phase 4**
  - Stripe subscription end-to-end; AI monthly report stored to insights and viewable; module gating respects subscription state.

## 19. Backlog (Prioritized Must-have → Nice-to-have)
- **Must-have:** Budget CRUD, Transactions CRUD/import, Dashboard core widgets, Auth + RLS, Mobile add speed.
- **Should-have:** Debt payoff basic, Goals, Theme presets, Insights feed (rule-based).
- **Nice-to-have:** Bank sync (Plaid), Investments live quotes, AI reports, What-Ifs, Insurance vault, Tax exports, Monte Carlo.

## 20. Developer Runbook (Quick Start)
1. **Supabase**
   ```
   supabase init
   supabase start
   # apply migrations:
   supabase db reset # dev only
   ```
2. Configure ENV in `app/.env` and Supabase project.
3. **Run app**
   ```
   cd app
   npm run dev
   ```
4. **Edge functions**
   ```
   supabase functions new stripe-webhook
   supabase functions deploy stripe-webhook
   # repeat for ai-generate-report, plaid-webhook (if used)
   ```

## 21. UX Flows (Short)
- **Onboarding:** Create account → choose currency/locale → pick starting modules (default: Budget) → add first account (manual balance) → add first transaction → dashboard shows change → nudge to set first goal.
- **Close Month:** Tap “Review Month” → see overs/unders by category → accept carryovers → create next month’s budgets.
- **Upgrade:** User hits premium feature → modal with benefits & plan → Stripe Checkout → return → features unlocked.

---

**Related reading:** [Part 1 — Product Plan](PRODUCT_PLAN_PART1.md) for vision, UX principles, and module intent. Validate new technical changes against that narrative to avoid scope drift.
