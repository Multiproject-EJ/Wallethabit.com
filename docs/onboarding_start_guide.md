# Website-wide Start Guide (Onboarding Wizard)

This document captures the proposed 12-step onboarding wizard that introduces new WalletHabit users to the platform, tailors the experience to their goals, and seeds the Supabase database with sensible defaults. It is intended as implementation guidance for designers, engineers, and data teams.

## 0. Trigger & Persistence
- Show the guide when `profiles.onboarded_at` is `NULL` or when a signed-in user chooses **Start Setup Guide** from the header.
- Persist progress (`onboarding_step`) in both `profiles` and `localStorage` so that the user can pause and resume at any time.

## Step 1 — Welcome & Mode Selection
- Headline: “Let’s build your personal Finance OS.”
- Options: **Explore with Demo Data** or **Build My Plan**.
- Demo sets an in-session `is_demo=true` flag and preloads a curated dataset (accounts, starter budget, debts, savings, investments, and notifications) so the dashboard feels alive immediately.
- Choosing demo also skips directly to the **Review** step; switching back to **Build My Plan** flushes the staged demo data so the user starts with a clean slate.
- Selecting **Build My Plan** advances to Step 2.

## Step 2 — Basics (Name & Region)
- Collect: first name, country/region (auto-detected), currency (defaults from region), timezone, date format, theme mode, accent colour.
- Write to `profiles`: `display_name`, `country`, `currency_code`, `timezone`, `date_format`, `theme`, `accent_color`.
- If unauthenticated, buffer in localStorage until sign-up completes.

## Step 3 — Focus Areas (Goals)
- Multi-select chips (Control spending, Pay off debt, Build emergency fund, Track investments, Plan a big purchase, Prepare taxes).
- Optional primary goal target date slider.
- For each selected goal, seed a stub row in `goals` (e.g., Emergency Fund default to 3× monthly expenses once income is known).
- Selected goals pre-populate module recommendations for Step 4.

## Step 4 — Module Activation
- Grid of module cards (Budget, Debts, Savings, Investments, Income/Side Hustles, Real Estate, Insurance, Taxes, Retire, AI Advisor).
- Toggle per card; badges for **Recommended** and **Premium**.
- Persist enabled modules to `modules_enabled` (`module_key`, `enabled=true`).
- Premium toggles set `pending_upgrade=true`; allow “try later” without blocking.

## Step 5 — Income & Accounts
- Options: **Manual**, **CSV import** (later), **Connect bank** (premium optional).
- Manual form fields: monthly net salary, payday, current account balance, savings balance.
- Write to `accounts` (Current, Savings) and create initial salary `transactions` (current month plus optional prior month for charts).

## Step 6 — Budget Quick-Start
- Pre-fill monthly take-home income and offer templates (50/30/20, Essentials-First, Custom).
- Let users adjust categories (Groceries, Dining, Transport, Rent, Utilities, Subscriptions, Health, Fun, Other).
- Create `categories` entries and `budgets` records for the current period (`YYYY-MM`, `amount_planned`).
- Provide live budget preview bars.

## Step 7 — Debts (Conditional)
- If Debts module enabled: capture credit card and optional student loan (balance, APR, minimum payment).
- Store in `debts`; optionally seed current month `debt_payments` for minimums.
- Unlock dashboard debt payoff meter with an estimated payoff date.

## Step 8 — Savings Goals
- Auto-suggest Emergency Fund (3× expenses) and optional Holiday goal.
- Capture contribution sliders (amount per month) and show estimated completion dates.
- Store in `goals`; create planned transfer templates or reminders in `transactions`.

## Step 9 — Investments (Optional)
- Let the user add a brokerage balance and up to two holdings (e.g., VOO, BTC) or skip.
- Note that live quotes require premium, but do not block activation.
- Persist holdings to `assets` / `holdings` with quantities and current prices.

## Step 10 — Reminders & Insights
- Toggles for Monthly report, Overspend alerts, Bill reminders, Goal nudges.
- Frequency options: Smart (default), Weekly, Off.
- Store preferences in `profiles` or `notification_prefs`.

## Step 11 — Layout & Theme
- Allow theme (light/dark) and accent colour adjustments.
- Drag-and-drop dashboard widgets; toggle visibility per card.
- Write layout JSON to `dashboard_layout` (e.g., `[{"widget":"net_worth","row":1,"col":1}]`).

## Step 12 — Review & Commit
- Present a summary: profile info, modules, accounts, budget snapshot, goals, debts.
- Actions: **Finish & Go to Dashboard** or **Load with Demo Data instead**.
- Persist all buffered data and set `profiles.onboarded_at = now()`.
- For demo mode, tag inserted rows with `is_demo=true` and surface an option to “Replace demo with real data” later.

## Step 13 — First-Run Tour
- 5 quick tooltips (Quick Add, Budget bars, Debt meter/Goal rings, Insights panel, Modules menu).
- Call-to-action chip: **Try adding a transaction now**.

## State & Persistence Model
- Maintain an `OnboardingState` object in memory and localStorage.
- Only write to Supabase after authentication or at Step 12 completion.
- Include `onboarding_step` for resume capability and show a "Continue setup" prompt on return.

## Tone & Accessibility
- Supportive copy: “We’ll keep this fast”, “You can change later”, “Skip for now”.
- Celebrate progress (“Great job—budget is ready 🎯”) and offer gentle nudges post-onboarding.
- Mobile-first layout, single column per step, accessible controls with ARIA labels, keyboard navigation, and persistent progress indicator.

## Monetisation Notes
- Premium modules trigger trial or `pending_upgrade` state but never block forward progress.
- After finishing, surface a subtle banner promoting Pro for AI reports and live quotes.

## Post-Onboarding Dashboard
- Default dashboard widgets: Net Worth line, Cash-flow bar, Budget bars, Goal rings, Debt meter, Insights feed.
- Checklist of next actions: add three recent transactions, confirm emergency fund target, optionally import last month via CSV.

