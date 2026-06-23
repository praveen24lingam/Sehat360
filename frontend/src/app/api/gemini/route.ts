import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limit: max 10 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || !('prompt' in body)) {
    return NextResponse.json({ error: 'missing_prompt' }, { status: 400 })
  }

  const prompt = (body as { prompt: unknown }).prompt
  if (typeof prompt !== 'string' || prompt.length === 0) {
    return NextResponse.json({ error: 'invalid_prompt' }, { status: 400 })
  }

  // Cap prompt size to prevent abuse (roughly 20k chars ~ 5k tokens)
  if (prompt.length > 20_000) {
    return NextResponse.json({ error: 'prompt_too_long' }, { status: 413 })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(prompt)
    return NextResponse.json({ text: result.response.text() })
  } catch (err) {
    console.error('[gemini/route] generation error:', err)
    return NextResponse.json({ error: 'generation_failed' }, { status: 500 })
  }
}
