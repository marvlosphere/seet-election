import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminAuthed } from '@/lib/adminAuth'

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
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  await db.from('admin_sessions').delete().lt('expires_at', new Date().toISOString())

  const { data } = await db
    .from('admin_sessions')
    .select('id, ip_address, created_at, expires_at')
    .order('created_at', { ascending: false })

  return NextResponse.json({
    count: data?.length ?? 0,
    sessions: data ?? [],
  }, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
  })
}