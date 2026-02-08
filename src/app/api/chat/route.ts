import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type ChatRequestBody = {
  sessionId: string
  text: string
}

function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    throw new Error('Missing GEMINI_API_KEY')
  }
  return key
}

function extractGeminiText(data: any): string {
  const parts = data?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return ''
  return parts.map((p: any) => p?.text ?? '').join('')
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as Partial<ChatRequestBody>
    const sessionId = body.sessionId?.trim()
    const text = body.text?.trim()

    if (!sessionId || !text) {
      return NextResponse.json(
        { error: 'Missing sessionId or text' },
        { status: 400 },
      )
    }

    const showAll = process.env.CHAT_SHOW_ALL === 'true'

    // Ensure the user can access this session (unless explicitly disabled)
    const session = await prisma.chatSession.findFirst({
      where: showAll ? { id: sessionId } : { id: sessionId, userId: user.id },
      select: { id: true },
    })

    if (!session) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 })
    }

    // 1) Retrieve last 10 messages from DB for context
    const history = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { role: true, content: true },
    })

    const historyAsc = history.slice().reverse()

    // 2) Construct Gemini payload
    const systemInstruction =
      process.env.CHAT_SYSTEM_PROMPT ??
      'Kamu adalah asisten yang helpful. Jawab dengan jelas dan ringkas.'

    const contents = [
      ...historyAsc.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text }] },
    ]

    const model = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash'
    const apiKey = getGeminiApiKey()
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    // 3) Call Gemini
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature: 0.7,
        },
      }),
    })

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      return NextResponse.json(
        { error: 'Gemini API error', details: errText },
        { status: 502 },
      )
    }

    const data = await geminiRes.json()
    const assistantText = extractGeminiText(data).trim()

    if (!assistantText) {
      return NextResponse.json(
        { error: 'Empty response from Gemini', raw: data },
        { status: 502 },
      )
    }

    // 4) Save user + assistant messages to DB
    const [userMsg, assistantMsg] = await prisma.$transaction([
      prisma.message.create({
        data: {
          sessionId,
          role: 'user',
          content: text,
        },
        select: { id: true, createdAt: true },
      }),
      prisma.message.create({
        data: {
          sessionId,
          role: 'assistant',
          content: assistantText,
        },
        select: { id: true, createdAt: true },
      }),
      prisma.chatSession.update({
        where: { id: sessionId },
        data: { lastMessageAt: new Date() },
        select: { id: true },
      }),
    ])

    return NextResponse.json({
      userMessage: {
        id: userMsg.id,
        role: 'user' as const,
        text,
        createdAt: userMsg.createdAt.getTime(),
      },
      assistantMessage: {
        id: assistantMsg.id,
        role: 'assistant' as const,
        text: assistantText,
        createdAt: assistantMsg.createdAt.getTime(),
      },
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Unexpected error', details: e?.message ?? String(e) },
      { status: 500 },
    )
  }
}
