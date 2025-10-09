import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

let client: SupabaseClient | null = null

if (hasSupabaseConfig) {
  client = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
} else {
  if (import.meta.env.DEV) {
    console.info(
      'Supabase client running in placeholder mode — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable auth.',
    )
  }
}

export const supabase = client

export const supabaseEnvGuidance = [
  'Create a Supabase project and grab the URL + anon key.',
  'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to GitHub Secrets.',
  'Expose them to the Pages build so the browser SDK can hydrate.',
]
