import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Only initialise the client when credentials are present
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function captureLeadEmail(email: string, challengeName: string): Promise<void> {
  if (!supabase) return  // silently skip if Supabase not configured yet
  const { error } = await supabase
    .from('leads')
    .insert({ email, challenge: challengeName })
  if (error) throw error
}
