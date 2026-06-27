import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAdminAuthed } from '@/lib/adminAuth'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()

  const { data: votes } = await db
    .from('votes')
    .select('candidate_id, position')

  if (!votes || votes.length === 0) return NextResponse.json([])

  const candidateIds = Array.from(new Set(votes.map(v => v.candidate_id)))
  const { data: candidates } = await db
    .from('candidates')
    .select('id, name')
    .in('id', candidateIds)

  const counts: Record<string, { candidate_id: string; candidate_name: string; position: string; vote_count: number }> = {}

  for (const vote of votes) {
    const key = vote.candidate_id
    if (!counts[key]) {
      const candidate = candidates?.find(c => c.id === vote.candidate_id)
      counts[key] = {
        candidate_id: vote.candidate_id,
        candidate_name: candidate?.name ?? 'Unknown',
        position: vote.position,
        vote_count: 0,
      }
    }
    counts[key].vote_count++
  }

  return NextResponse.json(Object.values(counts))
}
