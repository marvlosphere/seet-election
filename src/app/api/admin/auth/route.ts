import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { key } = await req.json()
  if (key !== process.env.ADMIN_KEY) return NextResponse.json({ error: 'Invalid key' }, { status: 401 })
  return NextResponse.json({ success: true })
}
