'use server'

import { revalidatePath } from 'next/cache'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function sendMessageAction(sessionId: string, text: string) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // By default we only allow sending messages to sessions owned by the logged-in user.
  // For demos/admin usage you can set CHAT_SHOW_ALL=true to bypass this ownership check.
  const showAll = process.env.CHAT_SHOW_ALL === 'true'

  const session = await prisma.chatSession.findFirst({
    where: showAll ? { id: sessionId } : { id: sessionId, userId: user.id },
    select: { id: true },
  })

  if (!session) {
    throw new Error('Chat session not found')
  }

  await prisma.message.create({
    data: {
      sessionId,
      role: 'user',
      content: text,
    },
  })

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { lastMessageAt: new Date() },
  })

  revalidatePath('/chat')
}
