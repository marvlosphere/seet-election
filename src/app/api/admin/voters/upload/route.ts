import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAdminAuthed } from '@/lib/adminAuth'
import { generateToken, normalizePhone } from '@/lib/utils'

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { csv } = await req.json()
    if (!csv) return NextResponse.json({ error: 'No CSV provided' }, { status: 400 })
    const lines = csv.trim().split('\n').map((l: string) => l.trim()).filter(Boolean)
    const dataLines = lines[0].toLowerCase().includes('matric') ? lines.slice(1) : lines
    const voters = dataLines.map((line: string) => {
      const [matric_number, full_name, department, level, phone] = line.split(',').map((s: string) => s.trim())
      return {
        matric_number: matric_number?.toUpperCase(),
        full_name,
        department,
        level,
        phone: normalizePhone(phone ?? ''),
        token: generateToken(),
        token_used: false,
        has_voted: false,
      }
    }).filter((v: { matric_number: string; full_name: string }) => v.matric_number && v.full_name)
    const db = getDb()
    const { error } = await db.from('voters').upsert(voters, { onConflict: 'matric_number' })
    if (error) throw error
    return NextResponse.json({ count: voters.length })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
