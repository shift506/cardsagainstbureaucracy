import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Only initialise the client when credentials are present
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface LeadData {
  email: string
  name: string
  organisation: string
  challenge: string
  context: string
  stakeholders: string
  stakes: string
  transform_from: string
  transform_to: string
  transform_so_that: string
}

export async function captureLead(data: LeadData): Promise<void> {
  if (!supabase) return  // silently skip if Supabase not configured yet
  const { error } = await supabase.from('leads').insert(data)
  if (error) throw error
}
