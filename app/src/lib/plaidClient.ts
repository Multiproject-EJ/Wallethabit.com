const PLAID_CLIENT_ID = import.meta.env.VITE_PLAID_CLIENT_ID
const PLAID_SECRET = import.meta.env.VITE_PLAID_SECRET
const PLAID_ENV = import.meta.env.VITE_PLAID_ENV ?? 'sandbox'

export const hasPlaidConfig = Boolean(PLAID_CLIENT_ID && PLAID_SECRET)

export const plaidEnvGuidance = [
  'Set VITE_PLAID_CLIENT_ID to your Plaid client ID (use sandbox while testing).',
  'Add VITE_PLAID_SECRET with the matching sandbox secret in GitHub Secrets.',
  'Optionally configure VITE_PLAID_ENV = sandbox | development | production.',
  'Wire Supabase Edge Functions to proxy token exchange before going live.',
]

export function getPlaidEnvironmentLabel() {
  if (!hasPlaidConfig) return 'Sandbox pending'
  if (PLAID_ENV === 'production') return 'Production ready'
  if (PLAID_ENV === 'development') return 'Development mode'
  return 'Sandbox connected'
}
