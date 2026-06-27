import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAdminAuthed } from '@/lib/adminAuth'

async function sendSMS(phone: string, message: string) {
  const res = await fetch('https://api.ng.termii.com/api/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: phone,
      from: process.env.TERMII_SENDER_ID ?? 'SEETVote',
      sms: message,
      type: 'plain',
      channel: 'generic',
      api_key: process.env.TERMII_API_KEY,
    }),
  })
  return res.ok
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const db = getDb()
    const { data: voters } = await db.from('voters').select('id, full_name, phone, token, matric_number').eq('token_used', false).eq('has_voted', false)
    if (!voters || voters.length === 0) return NextResponse.json({ sent: 0 })
    let sent = 0, failed = 0
    for (const voter of voters) {
      const message = `Hello ${voter.full_name.split(' ')[0]}, your SEET Election token is: ${voter.token}\nMatric: ${voter.matric_number}\nVote at: ${process.env.NEXT_PUBLIC_APP_URL}/vote\nOne-time use only.`
      const ok = await sendSMS(voter.phone, message)
      if (ok) sent++; else failed++
      await new Promise(r => setTimeout(r, 100))
    }
    return NextResponse.json({ sent, failed })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to send tokens' }, { status: 500 })
  }
}
