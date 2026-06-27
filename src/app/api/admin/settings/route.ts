import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAdminAuthed } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const { data } = await db.from('election_settings').select('*').single()
  return NextResponse.json(data ?? { election_open: false })
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const body = await req.json()
  await db.from('election_settings').upsert({ id: 1, ...body, updated_at: new Date().toISOString() })
  return NextResponse.json({ success: true })
}
