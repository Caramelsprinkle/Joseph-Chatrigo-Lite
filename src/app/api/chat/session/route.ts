import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const showAll = process.env.CHAT_SHOW_ALL === 'true'

    // When showAll is enabled (demo/admin), we still create sessions under the current user.
    // This keeps ownership consistent once you turn showAll off.
    const title = 'New chat'

    const session = await prisma.chatSession.create({
      data: {
        userId: user.id,
        title,
        lastMessageAt: new Date(),
      },
      select: { id: true, title: true, createdAt: true },
    })

    return NextResponse.json({
      id: session.id,
      title: session.title,
      createdAt: session.createdAt.getTime(),
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Unexpected error', details: e?.message ?? String(e) },
      { status: 500 },
    )
  }
}
