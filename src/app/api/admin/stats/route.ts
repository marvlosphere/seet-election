import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAdminAuthed } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const { count: total_voters } = await db.from('voters').select('*', { count: 'exact', head: true })
  const { count: total_voted } = await db.from('voters').select('*', { count: 'exact', head: true }).eq('has_voted', true)
  const { count: tokens_sent } = await db.from('voters').select('*', { count: 'exact', head: true }).eq('token_used', true)
  return NextResponse.json({ total_voters: total_voters ?? 0, total_voted: total_voted ?? 0, tokens_sent: tokens_sent ?? 0 })
}
