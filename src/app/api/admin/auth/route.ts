import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const MAX_ATTEMPTS = 5
const LOCK_MINUTES = 15

function getDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const db = getDb()
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'

  const { data: rateData } = await db
    .from('rate_limit')
    .select('*')
    .eq('matric_number', `ADMIN_${ip}`)
    .single()

  if (rateData?.locked_until && new Date(rateData.locked_until) > new Date()) {
    const minutesLeft = Math.ceil((new Date(rateData.locked_until).getTime() - Date.now()) / 60000)
    return NextResponse.json({ error: `Too many failed attempts. Try again in ${minutesLeft} minutes.` }, { status: 429 })
  }

  const { key } = await req.json()

  if (key !== process.env.ADMIN_KEY) {
    const newAttempts = (rateData?.attempts ?? 0) + 1
    const shouldLock = newAttempts >= MAX_ATTEMPTS
    await db.from('rate_limit').upsert({
      matric_number: `ADMIN_${ip}`,
      attempts: newAttempts,
      locked_until: shouldLock ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000).toISOString() : null,
      last_attempt: new Date().toISOString(),
    }, { onConflict: 'matric_number' })

    await db.from('audit_log').insert({
      event_type: 'ADMIN_AUTH_FAILED',
      ip_address: ip,
      details: shouldLock ? 'IP locked out after 5 failed attempts' : `Attempt ${newAttempts} of ${MAX_ATTEMPTS}`,
      success: false,
    })

    return NextResponse.json({ error: 'Invalid key' }, { status: 401 })
  }

  await db.from('rate_limit').delete().eq('matric_number', `ADMIN_${ip}`)
  await db.from('audit_log').insert({
    event_type: 'ADMIN_AUTH_SUCCESS',
    ip_address: ip,
    details: 'Admin logged in',
    success: true,
  })

  return NextResponse.json({ success: true })
}
