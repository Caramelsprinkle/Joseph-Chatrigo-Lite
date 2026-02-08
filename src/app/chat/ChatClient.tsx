'use client'

import { useMemo, useState } from 'react'

import AppHeader from '@/components/AppHeader'
import ChatHistoryItem from '@/components/ChatHistoryItem'

export type ChatMessageDTO = {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: number
}

export type ConversationDTO = {
  id: string
  title: string
  avatarUrl?: string
  messages: ChatMessageDTO[]
}

type Props = {
  initialConversations: ConversationDTO[]
}

type ChatApiResponse = {
  userMessage: ChatMessageDTO
  assistantMessage: ChatMessageDTO
}

const ChatClient = ({ initialConversations }: Props) => {
  const [conversations, setConversations] = useState<ConversationDTO[]>(
    initialConversations,
  )
  const [activeConversationId, setActiveConversationId] = useState(
    initialConversations[0]?.id ?? '',
  )
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) ?? null
  }, [conversations, activeConversationId])

  const sidebarItems = useMemo(() => {
    return conversations.map((c) => {
      const last = c.messages[c.messages.length - 1]
      return {
        id: c.id,
        title: c.title,
        preview: last?.text,
        avatarUrl: c.avatarUrl,
      }
    })
  }, [conversations])

  async function sendMessage(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || !activeConversation || sending) return

    setSending(true)
    try {
      // Optimistic update
      const optimisticId = `tmp-${Date.now()}`
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: optimisticId,
                    role: 'user',
                    text: trimmed,
                    createdAt: Date.now(),
                  },
                ],
              }
            : c,
        ),
      )

      setInput('')

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: activeConversation.id, text: trimmed }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        const details =
          typeof err?.details === 'string'
            ? err.details
            : err?.details
              ? JSON.stringify(err.details)
              : ''

        throw new Error(
          [err?.error ?? 'Failed to send message', details].filter(Boolean).join(
            '\n',
          ),
        )
      }

      const data = (await res.json()) as ChatApiResponse

      // Replace the optimistic user message with the persisted one, then append assistant.
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversation.id) return c

          const messages = c.messages.map((m) =>
            m.id === optimisticId ? data.userMessage : m,
          )

          return {
            ...c,
            messages: [...messages, data.assistantMessage],
          }
        }),
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-300">
      <AppHeader />

      {/* History sidebar (left) + Chat bubbles (right) */}
      <div className="flex grow gap-2 p-2 min-h-0">
        {/* Sidebar */}
        <aside className="bg-neutral-50 w-80 max-w-[35%] rounded-lg flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-slate-200">
            <div className="text-slate-800 font-semibold">Chat history</div>
            <div className="text-xs text-slate-500">Select a conversation</div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {sidebarItems.map((item) => (
              <ChatHistoryItem
                key={item.id}
                title={item.title}
                preview={item.preview}
                avatarUrl={item.avatarUrl}
                active={item.id === activeConversationId}
                onClick={() => setActiveConversationId(item.id)}
              />
            ))}
          </div>
        </aside>

        {/* Messages area */}
        <div className="bg-neutral-50 flex-1 rounded-lg flex flex-col min-w-0">
          <div className="px-4 py-3 border-b border-slate-200">
            <div className="text-slate-800 font-semibold">
              {activeConversation?.title ?? 'Chat'}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {(activeConversation?.messages ?? []).map((msg) => (
              <div
                key={msg.id}
                className={
                  'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')
                }
              >
                <div
                  className={
                    'max-w-[75%] rounded-2xl px-4 py-2 break-words shadow-sm ' +
                    (msg.role === 'user'
                      ? 'bg-blue-100 text-slate-900'
                      : 'bg-orange-100 text-slate-900')
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-200">
            <form className="flex gap-2" onSubmit={sendMessage}>
              <input
                className="flex-1 px-3 h-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={sending}
                className="h-10 px-4 bg-orange-400 text-white rounded-lg hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatClient
