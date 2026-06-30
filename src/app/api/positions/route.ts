import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' }),
      },
    }
  )
}

export async function GET(req: NextRequest) {
  const db = getDb()
  const { data } = await db
    .from('positions')
    .select('name')
    .order('display_order')
    .order('name')

  return NextResponse.json((data ?? []).map(p => p.name), {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
  })
}