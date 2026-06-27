// ─── Server-only Supabase clients ────────────────────────────────────────────
// Only import this in API routes (src/app/api/...), never in page components

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// For most API operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For admin operations that bypass RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
