import { useEffect, useMemo, useState } from 'react'

import { useDemoData } from '../lib/demoDataStore'

type TaxInputKey =
  | 'salary'
  | 'sideIncome'
  | 'retirementContribution'
  | 'businessExpenses'
  | 'taxAdvantagedContribution'
  | 'taxWithheld'

type TaxInputs = Record<TaxInputKey, number>

type InputRange = {
  min: number
  max: number
  step: number
}

type TaxProfile = {
  id: string
  label: string
  description: string
  defaults: Partial<TaxInputs>
  ranges?: Partial<Record<TaxInputKey, InputRange>>
}

type TaxInputDefinition = {
  key: TaxInputKey
  label: string
  defaultRange: InputRange
  columns?: 'full'
  helper?: (helpers: ScenarioHelpers) => string | undefined
}

type Formatters = {
  currency: Intl.NumberFormat
  percent: Intl.NumberFormat
}

type ScenarioHelpers = {
  formatters: Formatters
}

type TaxMetric = {
  label: string
  value: string
}

type StrategyPlay = {
  title: string
  description: string
}

type Milestone = {
  label: string
  timeframe: string
  description: string
}

type SetAsideCard = {
  eyebrow: string
  amount: string
  description: string
}

type TaxRegionScenario = {
  metrics: TaxMetric[]
  opportunitySignals: string[]
  strategyPlays: StrategyPlay[]
  readinessChecklist: string[]
  guardrails: string[]
  copilotPrompts: string[]
  rolloutMilestones: Milestone[]
  setAsideCard?: SetAsideCard
}

type TaxRegionDefinition = {
  id: 'uk' | 'us' | 'no'
  badgeLabel: string
  heroTitle: string
  heroDescription: string
  heroWhyTitle: string
  heroWhyDescription: string
  profiles: TaxProfile[]
  inputs: TaxInputDefinition[]
  buildScenario: (args: { inputs: TaxInputs; profile: TaxProfile; formatters: Formatters }) => TaxRegionScenario
}

const clamp = (value: number) => Math.max(0, value)

const DEFAULT_INPUTS: TaxInputs = {
  salary: 0,
  sideIncome: 0,
  retirementContribution: 0,
  businessExpenses: 0,
  taxAdvantagedContribution: 0,
  taxWithheld: 0,
}

// United Kingdom helpers
const UK_ISA_ALLOWANCE = 20000
const UK_PENSION_ALLOWANCE = 40000
const UK_PERSONAL_ALLOWANCE = 12570
const UK_BASIC_RATE_BAND = 37700
const UK_HIGHER_RATE_BAND = 74870
const UK_CLASS1_NI_LOWER_LIMIT = 12570
const UK_CLASS1_NI_UPPER_LIMIT = 50270
const UK_CLASS1_MAIN_RATE = 0.1
const UK_CLASS1_UPPER_RATE = 0.02
const UK_CLASS4_LOWER_PROFITS_LIMIT = 12570
const UK_CLASS4_UPPER_PROFITS_LIMIT = 50270
const UK_CLASS4_MAIN_RATE = 0.09
const UK_CLASS4_UPPER_RATE = 0.02
const UK_STUDENT_LOAN_PLAN_2_THRESHOLD = 27295

const calculateUkIncomeTax = (taxableIncome: number) => {
  if (taxableIncome <= 0) {
    return 0
  }

  const basicBand = Math.min(taxableIncome, UK_BASIC_RATE_BAND)
  const higherBand = Math.min(Math.max(taxableIncome - basicBand, 0), UK_HIGHER_RATE_BAND)
  const additionalBand = Math.max(taxableIncome - basicBand - higherBand, 0)

  return basicBand * 0.2 + higherBand * 0.4 + additionalBand * 0.45
}

const calculateUkClass1NationalInsurance = (salary: number) => {
  if (salary <= UK_CLASS1_NI_LOWER_LIMIT) {
    return 0
  }

  const mainBand = Math.min(salary, UK_CLASS1_NI_UPPER_LIMIT) - UK_CLASS1_NI_LOWER_LIMIT
  const upperBand = Math.max(salary - UK_CLASS1_NI_UPPER_LIMIT, 0)

  return clamp(mainBand) * UK_CLASS1_MAIN_RATE + upperBand * UK_CLASS1_UPPER_RATE
}

const calculateUkClass4NationalInsurance = (profit: number) => {
  if (profit <= UK_CLASS4_LOWER_PROFITS_LIMIT) {
    return 0
  }

  const mainBand = Math.min(profit, UK_CLASS4_UPPER_PROFITS_LIMIT) - UK_CLASS4_LOWER_PROFITS_LIMIT
  const upperBand = Math.max(profit - UK_CLASS4_UPPER_PROFITS_LIMIT, 0)

  return clamp(mainBand) * UK_CLASS4_MAIN_RATE + upperBand * UK_CLASS4_UPPER_RATE
}

const calculateUkPersonalAllowance = (adjustedNetIncome: number) => {
  if (adjustedNetIncome <= 100000) {
    return UK_PERSONAL_ALLOWANCE
  }

  const reduction = Math.floor((adjustedNetIncome - 100000) / 2)
  return Math.max(UK_PERSONAL_ALLOWANCE - reduction, 0)
}

const calculateUkScenario = (inputs: TaxInputs) => {
  const netSideProfit = clamp(inputs.sideIncome - inputs.businessExpenses)
  const adjustedNetIncome = clamp(inputs.salary + netSideProfit - inputs.retirementContribution)
  const personalAllowance = calculateUkPersonalAllowance(adjustedNetIncome)
  const taxableIncome = clamp(adjustedNetIncome - personalAllowance)
  const incomeTax = calculateUkIncomeTax(taxableIncome)
  const class1NationalInsurance = calculateUkClass1NationalInsurance(inputs.salary)
  const class4NationalInsurance = calculateUkClass4NationalInsurance(netSideProfit)
  const studentLoanPayment = clamp(inputs.salary + inputs.sideIncome - UK_STUDENT_LOAN_PLAN_2_THRESHOLD) * 0.09
  const totalTax = incomeTax + class1NationalInsurance + class4NationalInsurance + studentLoanPayment
  const grossIncome = inputs.salary + inputs.sideIncome
  const effectiveRate = grossIncome === 0 ? 0 : totalTax / grossIncome
  const hmrcSetAside = netSideProfit * 0.25

  return {
    taxableIncome,
    totalTax,
    incomeTax,
    personalAllowanceRemaining: Math.max(personalAllowance - Math.min(personalAllowance, adjustedNetIncome), 0),
    pensionAllowanceRemaining: Math.max(UK_PENSION_ALLOWANCE - inputs.retirementContribution, 0),
    isaAllowanceRemaining: Math.max(UK_ISA_ALLOWANCE - inputs.taxAdvantagedContribution, 0),
    netSideProfit,
    hmrcSetAside,
    hmrcMonthlySetAside: hmrcSetAside / 12,
    studentLoanPayment,
    effectiveRate,
    takeHomeAfterContributions:
      grossIncome -
      totalTax -
      inputs.retirementContribution -
      inputs.taxAdvantagedContribution -
      Math.min(inputs.businessExpenses, inputs.sideIncome),
  }
}

const buildUkScenario = (inputs: TaxInputs, formatters: Formatters) => {
  const scenario = calculateUkScenario(inputs)
  const scenarioWithoutPension = calculateUkScenario({
    ...inputs,
    retirementContribution: 0,
  })

  const annualTaxRelief = Math.max(0, scenarioWithoutPension.totalTax - scenario.totalTax)

  return {
    scenario,
    annualTaxRelief,
    metrics: [
      {
        label: 'Taxable income',
        value: formatters.currency.format(scenario.taxableIncome),
      },
      {
        label: 'Estimated tax bill',
        value: formatters.currency.format(scenario.totalTax),
      },
      {
        label: 'Annual tax relief',
        value: formatters.currency.format(annualTaxRelief),
      },
      {
        label: 'Effective tax rate',
        value: formatters.percent.format(scenario.effectiveRate),
      },
    ],
  }
}

// United States helpers
const US_STANDARD_DEDUCTION = 13850
const US_FEDERAL_BRACKETS: Array<{ limit: number; rate: number }> = [
  { limit: 11000, rate: 0.1 },
  { limit: 44725, rate: 0.12 },
  { limit: 95375, rate: 0.22 },
  { limit: 182100, rate: 0.24 },
  { limit: 231250, rate: 0.32 },
  { limit: 578125, rate: 0.35 },
]

const calculateUsFederalTax = (taxableIncome: number) => {
  if (taxableIncome <= 0) {
    return 0
  }

  let remaining = taxableIncome
  let tax = 0
  let previousLimit = 0

  for (const bracket of US_FEDERAL_BRACKETS) {
    if (remaining <= 0) {
      break
    }

    const span = Math.min(remaining, bracket.limit - previousLimit)
    tax += span * bracket.rate
    remaining -= span
    previousLimit = bracket.limit
  }

  if (remaining > 0) {
    tax += remaining * 0.37
  }

  return tax
}

const buildUsScenario = (inputs: TaxInputs, formatters: Formatters) => {
  const netSideProfit = clamp(inputs.sideIncome - inputs.businessExpenses)
  const adjustedGrossIncome = clamp(
    inputs.salary +
      netSideProfit -
      inputs.retirementContribution -
      inputs.taxAdvantagedContribution,
  )
  const taxableIncome = clamp(adjustedGrossIncome - US_STANDARD_DEDUCTION)
  const federalTax = calculateUsFederalTax(taxableIncome)
  const selfEmploymentTax = netSideProfit * 0.153
  const totalTaxLiability = federalTax + selfEmploymentTax
  const grossIncome = inputs.salary + inputs.sideIncome
  const effectiveRate = grossIncome === 0 ? 0 : totalTaxLiability / grossIncome
  const estimatedBalanceDue = Math.max(totalTaxLiability - inputs.taxWithheld, 0)

  return {
    taxableIncome,
    totalTaxLiability,
    federalTax,
    selfEmploymentTax,
    netSideProfit,
    estimatedBalanceDue,
    quarterlyEstimate: estimatedBalanceDue / 4,
    effectiveRate,
    metrics: [
      { label: 'Taxable income', value: formatters.currency.format(taxableIncome) },
      { label: 'Total tax liability', value: formatters.currency.format(totalTaxLiability) },
      { label: 'Quarterly estimate', value: formatters.currency.format(estimatedBalanceDue / 4) },
      { label: 'Effective tax rate', value: formatters.percent.format(effectiveRate) },
    ],
  }
}

// Norway helpers
const NORWAY_PERSONAL_ALLOWANCE = 79600
const NORWAY_NATIONAL_INSURANCE_RATE = 0.082
const NORWAY_BRACKETS: Array<{ threshold: number; rate: number }> = [
  { threshold: 208050, rate: 0.017 },
  { threshold: 292850, rate: 0.04 },
  { threshold: 670000, rate: 0.134 },
  { threshold: 937900, rate: 0.164 },
]

const calculateNorwegianBracketTax = (taxableIncome: number) => {
  let remaining = Math.max(taxableIncome, 0)
  let tax = 0
  let previousThreshold = 0

  for (const bracket of NORWAY_BRACKETS) {
    if (remaining <= 0) {
      break
    }

    const span = Math.min(remaining, bracket.threshold - previousThreshold)
    tax += span * bracket.rate
    remaining -= span
    previousThreshold = bracket.threshold
  }

  if (remaining > 0) {
    tax += remaining * 0.174
  }

  return tax
}

const buildNorwayScenario = (inputs: TaxInputs, formatters: Formatters) => {
  const netSideProfit = clamp(inputs.sideIncome - inputs.businessExpenses)
  const grossIncome = inputs.salary + inputs.sideIncome
  const deductions = Math.max(inputs.businessExpenses + inputs.retirementContribution, 0)
  const taxableIncome = clamp(grossIncome - deductions - NORWAY_PERSONAL_ALLOWANCE)
  const municipalTax = taxableIncome * 0.22
  const bracketTax = calculateNorwegianBracketTax(taxableIncome)
  const nationalInsurance = clamp(inputs.salary + netSideProfit) * NORWAY_NATIONAL_INSURANCE_RATE
  const totalTax = municipalTax + bracketTax + nationalInsurance
  const effectiveRate = grossIncome === 0 ? 0 : totalTax / grossIncome

  return {
    taxableIncome,
    totalTax,
    municipalTax,
    bracketTax,
    nationalInsurance,
    effectiveRate,
    netSideProfit,
    monthlyReserve: totalTax / 12,
    metrics: [
      { label: 'Taxable income', value: formatters.currency.format(taxableIncome) },
      { label: 'Estimated tax bill', value: formatters.currency.format(totalTax) },
      { label: 'Municipal + trinnskatt', value: formatters.currency.format(municipalTax + bracketTax) },
      { label: 'Effective tax rate', value: formatters.percent.format(effectiveRate) },
    ],
  }
}

const taxRegions: Record<TaxRegionDefinition['id'], TaxRegionDefinition> = {
  uk: {
    id: 'uk',
    badgeLabel: 'Updated • HMRC planning lab',
    heroTitle: 'Stay ahead of HMRC across PAYE, freelance, and student loans.',
    heroDescription:
      'Model how pension salary sacrifice, ISA contributions, and freelance expenses shift your Self Assessment bill. The demo uses Alex Rivera’s UK data so every slider feels grounded in reality.',
    heroWhyTitle: 'Why this matters',
    heroWhyDescription:
      'Balancing PAYE and side gigs means different rules for tax, NI, and student loans. Map them here so cash you free up can power Alex’s goals, protection cover, and investing autopilot.',
    profiles: [
      {
        id: 'paye-designer',
        label: 'PAYE product designer',
        description:
          'Full-time salary through PAYE with a couple of freelance sprints each quarter and a Plan 2 student loan still in play.',
        defaults: {
          salary: 58000,
          sideIncome: 6000,
          retirementContribution: 4200,
          businessExpenses: 1200,
          taxAdvantagedContribution: 4800,
        },
        ranges: {
          salary: { min: 45000, max: 85000, step: 1000 },
          sideIncome: { min: 0, max: 12000, step: 500 },
          retirementContribution: { min: 0, max: 12000, step: 250 },
          businessExpenses: { min: 0, max: 5000, step: 250 },
          taxAdvantagedContribution: { min: 0, max: UK_ISA_ALLOWANCE, step: 250 },
        },
      },
      {
        id: 'blended-freelancer',
        label: 'Hybrid freelancer',
        description:
          'Three days a week contracting on PAYE plus design retainers on the side — wants to stay ahead on Self Assessment.',
        defaults: {
          salary: 42000,
          sideIncome: 18000,
          retirementContribution: 5200,
          businessExpenses: 4500,
          taxAdvantagedContribution: 6000,
        },
        ranges: {
          salary: { min: 32000, max: 65000, step: 1000 },
          sideIncome: { min: 4000, max: 28000, step: 500 },
          retirementContribution: { min: 0, max: 15000, step: 250 },
          businessExpenses: { min: 0, max: 9000, step: 250 },
          taxAdvantagedContribution: { min: 0, max: UK_ISA_ALLOWANCE, step: 250 },
        },
      },
      {
        id: 'independent-consultant',
        label: 'Independent consultant',
        description:
          'Higher-rate contractor taking advantage of pension salary sacrifice and ISA automation to stay tax efficient.',
        defaults: {
          salary: 82000,
          sideIncome: 9000,
          retirementContribution: 12800,
          businessExpenses: 2600,
          taxAdvantagedContribution: 12000,
        },
        ranges: {
          salary: { min: 65000, max: 110000, step: 1000 },
          sideIncome: { min: 0, max: 20000, step: 500 },
          retirementContribution: { min: 0, max: 20000, step: 250 },
          businessExpenses: { min: 0, max: 8000, step: 250 },
          taxAdvantagedContribution: { min: 0, max: UK_ISA_ALLOWANCE, step: 250 },
        },
      },
    ],
    inputs: [
      {
        key: 'salary',
        label: 'Gross PAYE salary',
        defaultRange: { min: 30000, max: 120000, step: 1000 },
      },
      {
        key: 'sideIncome',
        label: 'Freelance income',
        defaultRange: { min: 0, max: 40000, step: 500 },
      },
      {
        key: 'retirementContribution',
        label: 'Pension (salary sacrifice)',
        defaultRange: { min: 0, max: 20000, step: 250 },
        helper: ({ formatters }) =>
          `Annual allowance: ${formatters.currency.format(UK_PENSION_ALLOWANCE)}`,
      },
      {
        key: 'businessExpenses',
        label: 'Allowable expenses',
        defaultRange: { min: 0, max: 10000, step: 250 },
      },
      {
        key: 'taxAdvantagedContribution',
        label: 'ISA contributions',
        columns: 'full',
        defaultRange: { min: 0, max: UK_ISA_ALLOWANCE, step: 250 },
        helper: ({ formatters }) =>
          `ISA allowance: ${formatters.currency.format(UK_ISA_ALLOWANCE)}`,
      },
    ],
    buildScenario: ({ inputs, formatters }) => {
      const { scenario, annualTaxRelief, metrics } = buildUkScenario(inputs, formatters)

      return {
        metrics,
        opportunitySignals: [
          scenario.personalAllowanceRemaining > 0
            ? `Personal allowance remaining: ${formatters.currency.format(
                scenario.personalAllowanceRemaining,
              )} before tapering kicks in.`
            : 'Personal allowance fully used — watch the £100k taper if income climbs higher.',
          scenario.pensionAllowanceRemaining > 0
            ? `Pension allowance headroom: ${formatters.currency.format(
                scenario.pensionAllowanceRemaining,
              )} until the £40k cap.`
            : 'Annual pension allowance maximised — consider ISA contributions next.',
          scenario.isaAllowanceRemaining > 0
            ? `ISA allowance remaining: ${formatters.currency.format(
                scenario.isaAllowanceRemaining,
              )} this tax year.`
            : 'ISA allowance maxed — redirect extras to high-yield savings or taxable investing.',
          scenario.netSideProfit > 0
            ? `Ring-fence ${formatters.currency.format(
                scenario.hmrcSetAside,
              )} (~25% of freelance profit) for HMRC.`
            : 'No freelance profit this year — HMRC payments on account likely minimal.',
          scenario.studentLoanPayment > 0
            ? `Plan 2 student loan repayments estimated at ${formatters.currency.format(
                scenario.studentLoanPayment,
              )} across the year.`
            : 'Student loan repayments not triggered at this income level.',
        ],
        strategyPlays: [
          {
            title: 'Automate pension + ISA top-ups',
            description: `Lock in salary-sacrifice pension contributions then sweep anything spare into your ISA before the ${formatters.currency.format(
              UK_ISA_ALLOWANCE,
            )} allowance resets on 6 April.`,
          },
          {
            title: 'Keep Self Assessment tidy',
            description:
              'Track invoices, expenses, and HMRC payments so January filings are a formality, not a scramble. Draft receipts straight into Supabase for easy exports.',
          },
          {
            title: 'Blend PAYE and freelance planning',
            description:
              'Use the lab to spot months where freelance profit spikes so you can pre-empt payments on account and keep cash flow steady.',
          },
        ],
        readinessChecklist: [
          'Download your P60 and latest payslips so the base PAYE numbers are accurate.',
          'Log freelance invoices, allowable expenses, and receipts as they land to support your Self Assessment.',
          'Confirm workplace pension contributions and employer match so salary sacrifice tallies with payroll.',
          'Record HMRC payments on account and balancing payments to keep projections synced.',
        ],
        guardrails: [
          'Keep total pension contributions within the £40k annual allowance unless you have carry-forward documented.',
          'Avoid breaching the £20k ISA allowance — excess needs unwinding with HMRC.',
          'Track adjusted net income if it approaches £100k so the personal allowance taper doesn’t surprise you.',
          'Remember payments on account can double-charge the first year you file — budget for both January and July deadlines.',
        ],
        copilotPrompts: [
          'Draft a January HMRC payment reminder with the amount to transfer from Monzo’s tax pot.',
          'Summarise how much tax relief pension salary sacrifice has unlocked so far this year.',
          'Monitor freelance invoices — nudge Alex if profit suggests topping up the tax reserve.',
          'Prepare a quick note on student loan progress if repayments accelerate.',
        ],
        rolloutMilestones: [
          {
            label: 'Supabase HMRC schema',
            timeframe: 'Week 1',
            description:
              'Model PAYE summaries, Self Assessment payments, pension contributions, and ISA activity with is_demo markers.',
          },
          {
            label: 'Bank + payroll ingestion',
            timeframe: 'Week 2',
            description:
              'Tag salary, pension, and freelance deposits from Monzo/Chase imports so withholding and set-asides stay current.',
          },
          {
            label: 'Self Assessment projections',
            timeframe: 'Week 3',
            description:
              'Generate rolling HMRC estimates, payments on account, and student loan forecasts from transaction data.',
          },
          {
            label: 'Advisor-ready exports',
            timeframe: 'Week 4',
            description:
              'Ship CSV + PDF summaries detailing PAYE vs. freelance income, expenses, and set-aside targets for accountants.',
          },
        ],
        setAsideCard: {
          eyebrow: 'Self Assessment prep',
          amount: `${formatters.currency.format(scenario.hmrcMonthlySetAside)} each month`,
          description:
            'Ring-fence this for January and July HMRC payments on account. Copilot will nudge two weeks before deadlines.',
        },
      }
    },
  },
  us: {
    id: 'us',
    badgeLabel: 'Updated • IRS planning lab',
    heroTitle: 'Balance W-2 withholding with quarterly estimated taxes.',
    heroDescription:
      'Blend PAYE-style paychecks, 1099 projects, and retirement moves. Tune Alex’s US twin so Safe Harbor rules, Roth conversions, and write-offs stay on track.',
    heroWhyTitle: 'Why this matters',
    heroWhyDescription:
      'Freelance spikes change how much you owe — and when. Get a live view so cash for taxes, goals, and investing all stay in flow.',
    profiles: [
      {
        id: 'w2-designer',
        label: 'W-2 product designer',
        description:
          'Full-time salary in New York plus design retainers that land a few times a year. Wants to stay safe-harbor compliant.',
        defaults: {
          salary: 105000,
          sideIncome: 18000,
          retirementContribution: 9000,
          businessExpenses: 3800,
          taxAdvantagedContribution: 3600,
          taxWithheld: 23000,
        },
        ranges: {
          salary: { min: 70000, max: 160000, step: 1000 },
          sideIncome: { min: 0, max: 40000, step: 500 },
          retirementContribution: { min: 0, max: 22500, step: 250 },
          businessExpenses: { min: 0, max: 15000, step: 250 },
          taxAdvantagedContribution: { min: 0, max: 7000, step: 250 },
          taxWithheld: { min: 0, max: 40000, step: 500 },
        },
      },
      {
        id: 'dual-income',
        label: 'Dual-income household',
        description:
          'Two W-2 earners plus a design side hustle. Running Roth conversions and HSA top-ups to stay efficient.',
        defaults: {
          salary: 165000,
          sideIncome: 24000,
          retirementContribution: 19500,
          businessExpenses: 5200,
          taxAdvantagedContribution: 7200,
          taxWithheld: 36500,
        },
        ranges: {
          salary: { min: 120000, max: 240000, step: 1000 },
          sideIncome: { min: 0, max: 60000, step: 500 },
          retirementContribution: { min: 0, max: 40000, step: 500 },
          businessExpenses: { min: 0, max: 20000, step: 250 },
          taxAdvantagedContribution: { min: 0, max: 12000, step: 250 },
          taxWithheld: { min: 0, max: 75000, step: 1000 },
        },
      },
      {
        id: 'solopreneur',
        label: 'Solo 1099 designer',
        description:
          'LLC S-corp taking reasonable salary, maxing Solo 401(k), and paying quarterly estimates.',
        defaults: {
          salary: 72000,
          sideIncome: 68000,
          retirementContribution: 24000,
          businessExpenses: 14500,
          taxAdvantagedContribution: 10000,
          taxWithheld: 12000,
        },
        ranges: {
          salary: { min: 40000, max: 120000, step: 1000 },
          sideIncome: { min: 20000, max: 120000, step: 1000 },
          retirementContribution: { min: 0, max: 40000, step: 500 },
          businessExpenses: { min: 0, max: 40000, step: 500 },
          taxAdvantagedContribution: { min: 0, max: 20000, step: 500 },
          taxWithheld: { min: 0, max: 40000, step: 1000 },
        },
      },
    ],
    inputs: [
      {
        key: 'salary',
        label: 'W-2 wages',
        defaultRange: { min: 40000, max: 250000, step: 1000 },
      },
      {
        key: 'sideIncome',
        label: '1099 / freelance income',
        defaultRange: { min: 0, max: 150000, step: 1000 },
      },
      {
        key: 'retirementContribution',
        label: 'Pre-tax retirement (401(k), SEP, etc.)',
        defaultRange: { min: 0, max: 40000, step: 500 },
      },
      {
        key: 'businessExpenses',
        label: 'Deductible business expenses',
        defaultRange: { min: 0, max: 40000, step: 500 },
      },
      {
        key: 'taxAdvantagedContribution',
        label: 'IRA / HSA contributions',
        defaultRange: { min: 0, max: 15000, step: 250 },
      },
      {
        key: 'taxWithheld',
        label: 'Tax already withheld',
        columns: 'full',
        defaultRange: { min: 0, max: 80000, step: 500 },
      },
    ],
    buildScenario: ({ inputs, formatters }) => {
      const scenario = buildUsScenario(inputs, formatters)

      return {
        metrics: scenario.metrics,
        opportunitySignals: [
          scenario.netSideProfit > 0
            ? `Set aside ${formatters.currency.format(
                scenario.estimatedBalanceDue,
              )} to stay on top of IRS quarterly estimates.`
            : 'No 1099 profit this year — quarterly estimates likely unnecessary.',
          inputs.retirementContribution < 22500
            ? `Room to defer another ${formatters.currency.format(
                22500 - inputs.retirementContribution,
              )} into pre-tax retirement.`
            : 'Pre-tax retirement limit hit — consider Roth conversions or brokerage investing.',
          inputs.taxAdvantagedContribution < 6500
            ? `Max an extra ${formatters.currency.format(
                6500 - inputs.taxAdvantagedContribution,
              )} in IRA/HSA savings before April 15.`
            : 'IRA/HSA limits met — channel surplus into brokerage or debt paydown.',
          scenario.federalTax > 0
            ? `Federal tax bill projected at ${formatters.currency.format(
                scenario.federalTax,
              )} after deductions.`
            : 'Federal tax wiped out by deductions and credits at this income.',
          scenario.selfEmploymentTax > 0
            ? `Self-employment tax around ${formatters.currency.format(
                scenario.selfEmploymentTax,
              )}; consider S-corp salary splits if profit stays high.`
            : 'Self-employment tax minimal — side work may stay under SE thresholds.',
        ],
        strategyPlays: [
          {
            title: 'Dial in Safe Harbor payments',
            description:
              'Auto-transfer the quarterly estimate so you hit 100% of last year’s liability (or 110% if AGI > $150k). No penalties, no surprises.',
          },
          {
            title: 'Stack retirement buckets',
            description:
              'Blend workplace plans with backdoor Roth or Solo 401(k) contributions so tax-free and tax-deferred balances both grow.',
          },
          {
            title: 'Track deductions in real time',
            description:
              'Log mileage, software, and home-office costs monthly so Schedule C write-offs are already reconciled when it’s time to file.',
          },
        ],
        readinessChecklist: [
          'Pull your latest paystubs to confirm year-to-date withholding and 401(k) deferrals.',
          'Organise 1099 invoices, receipts, and mileage logs inside Supabase for easy Schedule C exports.',
          'Schedule quarterly estimated payments (Form 1040-ES) inside your banking autopilot.',
          'Track state residency days if you split time between states — threshold rules differ widely.',
        ],
        guardrails: [
          'Avoid underpayment penalties by covering at least 90% of current-year tax or 100% of last year (110% if high income).',
          'Keep self-employment tax in view — S-corp salary elections only help if payroll filings stay current.',
          'Roth conversions increase AGI — coordinate with ACA subsidies and student loan recertifications.',
          'HSA eligibility requires a high-deductible health plan; pause contributions if coverage changes.',
        ],
        copilotPrompts: [
          'Draft a quarterly reminder for EFTPS with the target transfer amount.',
          'Explain how much 401(k) room is left this year and whether a backdoor Roth makes sense.',
          'Monitor profit spikes and warn if Safe Harbor coverage looks thin.',
          'Prep a summary of deductible design tools to share with the CPA.',
        ],
        rolloutMilestones: [
          {
            label: 'IRS-ready data model',
            timeframe: 'Week 1',
            description:
              'Store W-2, 1099, withholding, and estimated payment rows with links back to source transactions.',
          },
          {
            label: 'Quarterly estimate engine',
            timeframe: 'Week 2',
            description: 'Forecast Form 1040-ES vouchers with Safe Harbor guardrails and push to notifications.',
          },
          {
            label: 'State tax layering',
            timeframe: 'Week 3',
            description: 'Support multi-state moves with apportionment sliders and residency checklists.',
          },
          {
            label: 'CPA-ready exports',
            timeframe: 'Week 4',
            description: 'Generate P&L, deduction summaries, and payment schedules ready for your accountant.',
          },
        ],
        setAsideCard: {
          eyebrow: 'Quarterly estimated tax',
          amount: `${formatters.currency.format(scenario.quarterlyEstimate)} per quarter`,
          description:
            'Auto-transfer this into your tax savings bucket ahead of the April, June, September, and January deadlines.',
        },
      }
    },
  },
  no: {
    id: 'no',
    badgeLabel: 'Updated • Skatteetaten lab',
    heroTitle: 'Orchestrate Norwegian tax, trinnskatt, and national insurance.',
    heroDescription:
      'Pair PAYE income with consulting gigs while steering IPS and BSU savings. Keep Alex’s Oslo twin compliant and cash-rich.',
    heroWhyTitle: 'Why this matters',
    heroWhyDescription:
      'Norwegian taxes settle once a year, but the smartest teams reserve every month. See the gap early so feriepenge, goals, and buffers stay intact.',
    profiles: [
      {
        id: 'in-house-designer',
        label: 'In-house designer',
        description:
          'Product designer in Oslo with occasional freelance sprints. Building buffers while maxing BSU savings.',
        defaults: {
          salary: 720000,
          sideIncome: 60000,
          retirementContribution: 18000,
          businessExpenses: 8000,
          taxAdvantagedContribution: 27500,
        },
        ranges: {
          salary: { min: 500000, max: 1000000, step: 5000 },
          sideIncome: { min: 0, max: 150000, step: 2500 },
          retirementContribution: { min: 0, max: 60000, step: 1000 },
          businessExpenses: { min: 0, max: 50000, step: 1000 },
          taxAdvantagedContribution: { min: 0, max: 27500, step: 500 },
        },
      },
      {
        id: 'consultant',
        label: 'Consultant with enkelpersonforetak',
        description:
          'Runs their own foretak alongside full-time work. Wants to see how deductions and pension saving trim skatt.',
        defaults: {
          salary: 840000,
          sideIncome: 180000,
          retirementContribution: 42000,
          businessExpenses: 32000,
          taxAdvantagedContribution: 20000,
        },
        ranges: {
          salary: { min: 600000, max: 1200000, step: 5000 },
          sideIncome: { min: 50000, max: 250000, step: 5000 },
          retirementContribution: { min: 0, max: 80000, step: 1000 },
          businessExpenses: { min: 0, max: 100000, step: 1000 },
          taxAdvantagedContribution: { min: 0, max: 40000, step: 500 },
        },
      },
      {
        id: 'remote-worker',
        label: 'Remote worker moving back from London',
        description:
          'Splits time between UK and Norway — needs clarity on withholding, deductions, and BSU headroom.',
        defaults: {
          salary: 660000,
          sideIncome: 40000,
          retirementContribution: 12000,
          businessExpenses: 6000,
          taxAdvantagedContribution: 18000,
        },
        ranges: {
          salary: { min: 450000, max: 900000, step: 5000 },
          sideIncome: { min: 0, max: 120000, step: 2500 },
          retirementContribution: { min: 0, max: 50000, step: 1000 },
          businessExpenses: { min: 0, max: 40000, step: 1000 },
          taxAdvantagedContribution: { min: 0, max: 40000, step: 500 },
        },
      },
    ],
    inputs: [
      {
        key: 'salary',
        label: 'Lønn (PAYE)',
        defaultRange: { min: 400000, max: 1200000, step: 5000 },
      },
      {
        key: 'sideIncome',
        label: 'Frilans / næringsinntekt',
        defaultRange: { min: 0, max: 250000, step: 5000 },
      },
      {
        key: 'retirementContribution',
        label: 'IPS / pensjonssparing',
        defaultRange: { min: 0, max: 80000, step: 1000 },
      },
      {
        key: 'businessExpenses',
        label: 'Fradrag (utstyr, reise, kontor)',
        defaultRange: { min: 0, max: 100000, step: 1000 },
      },
      {
        key: 'taxAdvantagedContribution',
        label: 'BSU / aksjesparekonto innskudd',
        columns: 'full',
        defaultRange: { min: 0, max: 50000, step: 500 },
        helper: () => 'Maks BSU-innskudd 27 500 kr pr. år; overskytende går til ASK.',
      },
    ],
    buildScenario: ({ inputs, formatters }) => {
      const scenario = buildNorwayScenario(inputs, formatters)

      return {
        metrics: scenario.metrics,
        opportunitySignals: [
          scenario.netSideProfit > 0
            ? `Sett av ${formatters.currency.format(
                scenario.totalTax * 0.25,
              )} ekstra hvis næringsinntekten vokser.`
            : 'Ingen frilansoverskudd i år — forskuddsskatten forblir lav.',
          inputs.retirementContribution < 60000
            ? `Du kan fremdeles spare ${formatters.currency.format(
                60000 - inputs.retirementContribution,
              )} i IPS før årsslutt.`
            : 'IPS-kvoten er full — vurder ekstra innbetaling til arbeidsgivers pensjonsordning.',
          inputs.taxAdvantagedContribution < 27500
            ? `BSU-rom igjen: ${formatters.currency.format(
                27500 - inputs.taxAdvantagedContribution,
              )} denne skatteåret.`
            : 'BSU fullført — kanaliser resten til buffer eller investering.',
          scenario.municipalTax > 0
            ? `Kommune- og fylkesskatt ca. ${formatters.currency.format(
                scenario.municipalTax,
              )}. Hold av feriepenger til oppgjøret.`
            : 'Kommune- og fylkesskatt er utslettet av fradrag på dette nivået.',
          scenario.nationalInsurance > 0
            ? `Trygdeavgift rundt ${formatters.currency.format(
                scenario.nationalInsurance,
              )}; påvirkes av lønn og næringsinntekt.`
            : 'Trygdeavgift ubetydelig ved dagens nivå.',
        ],
        strategyPlays: [
          {
            title: 'Planlegg forskuddsskatt',
            description:
              'La Copilot foreslå månedlig trekk til egen skattebuffer slik at oppgjøret i juni er en formalitet.',
          },
          {
            title: 'Optimaliser BSU + ASK',
            description:
              'Hold BSU full, og la overskytende gå til aksjesparekonto for gunstig skatt på utbytte og gevinster.',
          },
          {
            title: 'Loggfør fradrag løpende',
            description:
              'Legg inn kvitteringer for hjemmekontor, reise og verktøy månedlig for å sikre at fradragene kommer med i skattemeldingen.',
          },
        ],
        readinessChecklist: [
          'Hent a-meldingen din og kontroller at forskuddstrekket matcher realiteten.',
          'Før opp næringsinntekt, kostnader og MVA i sanntid slik at næringsoppgaven blir enkel.',
          'Bekreft IPS/OTP-innskudd og arbeidsgiverbidrag før årsavslutning.',
          'Planlegg bostedsrapportering hvis du pendler eller jobber mye i utlandet.',
        ],
        guardrails: [
          'Betal forskuddsskatt innen fristene i mars, juni, september og desember for å unngå renter.',
          'Følg med på trinnskatt — høyere lønn kan flytte deg inn i nye satser gjennom året.',
          'Hold IPS-innskudd innenfor årlige grenser for å unngå ekstra skatt.',
          'Dokumenter utenlandsopphold for å sikre riktig beskatning og trygdetilhørighet.',
        ],
        copilotPrompts: [
          'Lag et forslag til fast månedlig skattetrekk til en egen konto.',
          'Oppsummer hvor mye BSU som er spart og hvor mye som gjenstår.',
          'Følg med på om næringsinntekten bør utløse høyere forskuddsskatt.',
          'Gi et varsel hvis IPS-innskuddet nærmer seg maks.',
        ],
        rolloutMilestones: [
          {
            label: 'Skatteetaten datastrøm',
            timeframe: 'Uke 1',
            description:
              'Kartlegg a-melding, forskuddsskatt og skattemelding-tabeller i Supabase med is_demo flagg.',
          },
          {
            label: 'Fradragsmotor',
            timeframe: 'Uke 2',
            description: 'Automatiser standardfradrag, minstefradrag og næringsfradrag ut fra transaksjonsdata.',
          },
          {
            label: 'Oppgjørssimulering',
            timeframe: 'Uke 3',
            description: 'Simuler junioppgjøret med variasjoner for trinnskatt, trygdeavgift og BSU/IPS-justeringer.',
          },
          {
            label: 'Rådgiverdashbord',
            timeframe: 'Uke 4',
            description: 'Del ferdige rapporter for kunde og revisor med fokus på fradrag og kontantstrøm.',
          },
        ],
        setAsideCard: {
          eyebrow: 'Skattebuffer',
          amount: `${formatters.currency.format(scenario.monthlyReserve)} per måned`,
          description:
            'Sett av dette hver måned så junioppgjøret og eventuelle restskatter er allerede dekket.',
        },
      }
    },
  },
}

const initializeInputs = (profile: TaxProfile | undefined, inputs: TaxInputDefinition[]): TaxInputs => {
  const base: TaxInputs = { ...DEFAULT_INPUTS }

  if (!profile) {
    return base
  }

  for (const input of inputs) {
    const defaultValue = profile.defaults[input.key]
    if (typeof defaultValue === 'number') {
      base[input.key] = defaultValue
    }
  }

  return base
}

export default function Taxes() {
  const {
    state: { profile: demoProfile },
  } = useDemoData()

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(demoProfile.localeId, {
        style: 'currency',
        currency: demoProfile.currency,
        maximumFractionDigits: 0,
      }),
    [demoProfile.currency, demoProfile.localeId],
  )

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(demoProfile.localeId, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [demoProfile.localeId],
  )

  const formatters = useMemo<Formatters>(
    () => ({
      currency: currencyFormatter,
      percent: percentFormatter,
    }),
    [currencyFormatter, percentFormatter],
  )

  const activeRegion = taxRegions[demoProfile.region] ?? taxRegions.uk

  const [profileId, setProfileId] = useState<string>(activeRegion.profiles[0]?.id ?? '')
  const profile = useMemo(
    () => activeRegion.profiles.find((item) => item.id === profileId) ?? activeRegion.profiles[0],
    [activeRegion.profiles, profileId],
  )

  const [inputs, setInputs] = useState<TaxInputs>(() => initializeInputs(profile, activeRegion.inputs))

  useEffect(() => {
    setProfileId((current) => {
      if (activeRegion.profiles.some((item) => item.id === current)) {
        return current
      }
      return activeRegion.profiles[0]?.id ?? ''
    })
  }, [activeRegion.profiles])

  useEffect(() => {
    setInputs(initializeInputs(profile, activeRegion.inputs))
  }, [profile, activeRegion.inputs])

  const scenario = useMemo(() => {
    if (!profile) {
      return undefined
    }

    return activeRegion.buildScenario({ inputs, profile, formatters })
  }, [activeRegion, formatters, inputs, profile])

  const updateInput = (key: TaxInputKey, value: number) => {
    setInputs((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  if (!profile || !scenario) {
    return null
  }

  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              {activeRegion.badgeLabel}
            </span>
            <h1 className="text-4xl font-bold text-slate-900">{activeRegion.heroTitle}</h1>
            <p className="text-sm text-slate-600">{activeRegion.heroDescription}</p>
          </div>
          <div className="rounded-2xl border border-brand/40 bg-brand/10 px-5 py-4 text-sm text-brand-dark">
            <p className="font-semibold">{activeRegion.heroWhyTitle}</p>
            <p className="mt-2">{activeRegion.heroWhyDescription}</p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Select a tax profile</p>
              <div className="flex flex-wrap gap-2">
                {activeRegion.profiles.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProfileId(item.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      item.id === profile.id
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-slate-300 text-slate-600 hover:border-brand/50 hover:text-brand'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-600">{profile.description}</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {activeRegion.inputs.map((input) => {
                const range = profile.ranges?.[input.key] ?? input.defaultRange
                const value = inputs[input.key]

                return (
                  <label
                    key={input.key}
                    className={`flex flex-col gap-2 ${input.columns === 'full' ? 'md:col-span-2' : ''}`}
                  >
                    <span className="text-xs uppercase tracking-wide text-slate-500">{input.label}</span>
                    <input
                      type="range"
                      min={range.min}
                      max={range.max}
                      step={range.step}
                      value={value}
                      onChange={(event) => updateInput(input.key, Number(event.currentTarget.value))}
                    />
                    <span className="text-lg font-semibold text-slate-900">
                      {formatters.currency.format(value)}
                    </span>
                    {input.helper ? (
                      <p className="text-xs text-slate-500">{input.helper({ formatters })}</p>
                    ) : null}
                  </label>
                )
              })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {scenario.metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-4 rounded-3xl border border-brand/40 bg-brand/10 p-6 text-sm text-brand-dark">
          <h3 className="text-base font-semibold text-brand-dark">Opportunity heatmap</h3>
          <ul className="space-y-3">
            {scenario.opportunitySignals.map((signal) => (
              <li key={signal} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand"></span>
                <p>{signal}</p>
              </li>
            ))}
          </ul>
          {scenario.setAsideCard ? (
            <div className="rounded-2xl border border-dashed border-brand/50 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-wide text-brand">{scenario.setAsideCard.eyebrow}</p>
              <p className="mt-1 text-base font-semibold text-brand-dark">{scenario.setAsideCard.amount}</p>
              <p className="mt-1 text-xs text-brand-dark/80">{scenario.setAsideCard.description}</p>
            </div>
          ) : null}
        </aside>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {scenario.strategyPlays.map((play) => (
          <article key={play.title} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{play.title}</h3>
            <p className="text-sm text-slate-600">{play.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Readiness checklist</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {scenario.readinessChecklist.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </article>
        <aside className="rounded-3xl border border-brand/40 bg-brand/10 p-6 text-sm text-brand-dark">
          <h3 className="text-base font-semibold text-brand-dark">Copilot prompts</h3>
          <ul className="mt-3 space-y-3">
            {scenario.copilotPrompts.map((prompt) => (
              <li key={prompt} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand"></span>
                <p>{prompt}</p>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Rollout milestones</h3>
          <ul className="mt-4 space-y-4 text-sm text-slate-600">
            {scenario.rolloutMilestones.map((milestone) => (
              <li key={milestone.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">{milestone.timeframe}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{milestone.label}</p>
                <p className="mt-1 text-sm text-slate-600">{milestone.description}</p>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Guardrails + watchouts</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {scenario.guardrails.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
