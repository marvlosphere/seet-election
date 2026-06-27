import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminAuthed } from '@/lib/adminAuth'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: allVoters } = await db
    .from('voters')
    .select('has_voted')

  const total_voters = allVoters?.length ?? 0
  const total_voted = allVoters?.filter((v: { has_voted: boolean }) => v.has_voted).length ?? 0

  return NextResponse.json({ total_voters, total_voted, tokens_sent: 0 })
}
