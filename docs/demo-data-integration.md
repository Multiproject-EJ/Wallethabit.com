# Demo Data Integration Blueprint

This document explains how the demo data for Alex Rivera fits together so the dashboard lights up immediately. It focuses on the relationships between modules, the data each one emits, and which widgets consume those aggregates. No implementation details or SQL—just a wiring diagram in words.

## 1. Persona Backbone
- **Primary profile:** Alex Rivera, 31-year-old product designer in London paid in GBP.
- **Profile settings:** Locale `en-GB`, currency `GBP`, and region flag `uk` so downstream modules (e.g., taxes) know which experience to render.
- **Lifecycle anchors:** PAYE salary (£3,600 net on the 28th), occasional freelance UX income (£400–£1,200 in May, September, and November), and consistent living costs tied to rent and utilities.
- Every module references this timeline so that income spikes, spending, debt reduction, and savings all align with Alex’s narrative.

## 2. Accounts and Balances
- **Cash accounts:** Monzo Current (operating cash), Chase Savings (short-term reserves), Amex Card (revolving credit), Brokerage (Freetrade).
- **Investment sub-accounts:** Held within Brokerage for VOO, FTSE All-Share, and BTC positions.
- Balances roll forward monthly from prior balance + inflows − outflows ± valuation changes.
- **Feeds:**
  - Net worth line uses all positive asset balances minus Amex and student loan liabilities.
  - Cash flow bar reads inflow/outflow totals directly from linked transactions.
  - Transfers between accounts (e.g., Monzo → Chase) are tagged so they don’t inflate spending.

## 3. Categories Framework
- Income categories: Salary, Side Hustle, Refunds.
- Fixed expenses: Rent, Utilities, Phone, Subscriptions, Insurance.
- Variable expenses: Groceries, Dining Out, Transport, Entertainment, Shopping, Health, Travel.
- Transfer tags: Savings Contributions, Debt Payments, Investment Buys/Sells.
- **Feeds:**
  - Cash flow heatmap aggregates income vs. expense categories by day and month.
  - Spending donut surfaces top five expense categories for the trailing 30 days.
  - Budget bars compare planned vs. actual per category each month.

## 4. Transaction Stream (12 Months)
- **Income cadence:** Salary on the 28th; freelance deposits in May, September, November with tax-reserve transfers.
- **Fixed costs:** Rent on the 1st, utilities on the 18th, insurance on the 15th, subscriptions sprinkled across the month.
- **Variable spending:** Weekly groceries, 2–4 dining transactions each week, daily/weekly transport taps, occasional shopping and health expenses, one-off holiday spike.
- **Transfers:** Monthly savings contributions (£250 to Emergency Fund, £100 to Holiday), Amex minimum + extra payments, monthly investment buys (£150–£250).
- **Feeds:**
  - Cash flow, budget actuals, and insight triggers all read from these tagged transactions.
  - Goal progress sums contributions tagged to each goal.
  - Debt module listens for payments to update amortization trackers.

## 5. Budgets Envelope
- Monthly plan: Groceries £260, Dining £180, Transport £120, Entertainment £80, Shopping £120, Health £40.
- Actuals wobble by 5–15% to create interest.
- No carryover for demo; toggle visible but disabled.
- **Feeds:**
  - Budget overview card shows planned vs. actual with traffic-light thresholds (<90% green, 90–110% amber, >110% red).
  - Insights flag overages (e.g., Dining >110%).

## 6. Debts Module
- **Amex Credit Card:** £2,400 at 19.9% APR; min £60; intermittent £40–£120 extra payments.
- **Student Loan:** £12,800 at 4.2% APR; £110/mo automatic.
- **Feeds:**
  - Debt payoff meter projects timelines (Snowball vs. Avalanche) based on recorded payments.
  - Net worth subtracts current balances.
  - Insights celebrate extra payments and quantify time saved.

## 7. Assets & Investments
- Holdings: 11.5 shares of VOO (avg £345, current £365), FTSE All-Share fund (£1,150), 0.06 BTC.
- Monthly valuation history includes random walk with a couple of dips plus occasional VOO dividends.
- **Feeds:**
  - Net worth trend ingests monthly valuations alongside cash balances.
  - Investment card shows allocation (equities vs. cash vs. crypto) and month-over-month change.
  - Insights spotlight portfolio performance and allocation imbalances.

## 8. Goals Engine
- **Emergency Fund:** Target £6,000 by month 10; receives £250/mo from savings transfers.
- **Holiday Fund:** Target £1,800 by month 6; receives £100/mo.
- Progress advances whenever a transaction tagged “Savings Contribution” hits the respective goal account.
- **Feeds:**
  - Goals widget displays percent complete and estimated completion date ((target − current)/average monthly contribution).
  - Insights announce milestones or being ahead/behind schedule.

## 9. Insurance & Protection
- Policies: Renter’s insurance (£14/mo) and phone insurance (£9/mo), both auto-renewing with a renewal reminder 60 days out.
- Protection lab presets pull from the profile region so copy, coverage gaps, and partner suggestions align with UK, US, or Norway demos.
- **Feeds:**
  - Optional protection card lists active policies and renewal notice.
  - Insight feed surfaces upcoming renewal reminder.

## 10. Estate & Legacy Planning
- Estate lab references the profile `region` to swap in UK, US, or Norway personas, terminology, and trust strategies.
- Slider ranges and hero metrics respect the locale’s currency using compact formatting so valuations read as £2.1M, $4.2M, or kr 3.1M out of the box.
- Guardianship checklists and rollout milestones auto-refresh with the right legal touchpoints when the demo region changes.

## 11. Taxes Layer
- Region-aware tax lab renders calculators, copy, and opportunity signals tuned to the demo profile’s `region` (`uk`, `us`, or `no`).
- For freelance months, a 20–25% tax set-aside transaction leaves Monzo for a virtual “Tax Reserve” tag.
- Annual summary aggregates side-hustle earnings vs. tax reserved.
- **Feeds:**
  - Insights remind Alex to set aside ~£85 in tax when freelance income lands.
  - Export CTA links to a prepped CSV of categorized transactions.

## 12. AI Advisor Narratives
- Monthly report: 3–5 bullets that reference net worth change, budget wins/slips, savings streaks, and debt progress.
- What-if scenarios (e.g., “Add £200/mo to savings”) rely on goal completion formulas.
- All flagged as demo-only content.
- **Feeds:**
  - Insights drawer houses these narratives and simulations.

## 13. Dashboard Wiring Summary
| Dashboard Widget | Upstream Modules | Notes |
| --- | --- | --- |
| Net Worth Line | Accounts, Debts, Investments | Falls back to cash − debts if investments off. |
| Cash Flow Bar | Transactions | Income vs. expense per month, transfers excluded. |
| Spending Donut | Transactions (expense categories) | Last 30 days, top five categories + “Other.” |
| Budget Bars | Budgets, Transactions | Planned vs. actual each category with color thresholds. |
| Goals Progress | Goals, Transactions (savings tags) | ETA derived from contribution velocity. |
| Debt Payoff Meter | Debts, Transactions (debt payments) | Shows Snowball and Avalanche timelines. |
| Investments Card | Investments, Accounts | Allocation, valuation trend, monthly change. |
| Insights Feed | All modules | Rule engine emits contextual nudges. |

## 14. Seeding Strategy
- Recommended path: SQL or JSON fixtures that create one profile, four accounts, 12 months of transactions, six budget rows, two debts, three assets, two goals, two policies, and 8–12 seeded insights.
- Every row carries `is_demo = true` so users can reset or replace with live data.
- Seeded datasets precompute monthly aggregates so charts render instantly at first load.

## 15. First-Open Experience
- Top banner: “You’re trending +£820 over the last 12 months. 🎯” (derived from net worth delta).
- Focus chip: “Remaining This Month: £420” from budget vs. actual aggregation.
- Primary CTAs: Add transaction, Create a goal, Connect bank.
- Hero insight: “Save £45/month by trimming subscriptions you barely use.” built from subscription spend analysis.

## 16. Resilience to Module Toggles
- `modules_enabled` flag controls which widgets render.
- Dependencies gracefully degrade: disabling Investments removes allocation + valuations but net worth recalculates from cash and debts; disabling Debts removes payoff card but net worth excludes liabilities; disabling Goals hides the goals widget and surfaces a CTA to create the first goal.

With this blueprint, engineers can script synthetic data that mirrors a believable financial life. Each module emits just enough structure for the dashboard to feel alive, and all aggregates interlock to keep the story coherent from the first click.
