import { redirect } from 'next/navigation'

import ChatClient, { type ConversationDTO } from './ChatClient'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const ChatPage = async () => {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // By default we scope chats to the logged-in user.
  // For demos/admin usage you can set CHAT_SHOW_ALL=true to show everyone's chats.
  const showAll = process.env.CHAT_SHOW_ALL === 'true'

  const sessions = await prisma.chatSession.findMany({
    ...(showAll ? {} : { where: { userId: user.id } }),
    orderBy: [{ lastMessageAt: 'desc' }, { updatedAt: 'desc' }],
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  const initialConversations: ConversationDTO[] = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    // Optional: store avatar in DB later; for now, static fallback
    avatarUrl: '/LogoChatrigo3.png',
    messages: s.messages.map((m) => ({
      id: m.id,
      role: m.role,
      text: m.content,
      createdAt: m.createdAt.getTime(),
    })),
  }))

  // Ensure UI doesn't crash when user has no sessions yet.
  const safeConversations: ConversationDTO[] =
    initialConversations.length > 0
      ? initialConversations
      : [
          {
            id: 'empty',
            title: 'New chat',
            avatarUrl: '/LogoChatrigo3.png',
            messages: [
              {
                id: 'welcome',
                role: 'assistant',
                text: 'No chats yet. Create one by seeding data or implementing a New Chat button.',
                createdAt: 0,
              },
            ],
          },
        ]

  return (
    <ChatClient
      initialConversations={safeConversations}
    />
  )
}

export default ChatPage
