'use client'

import { useMemo, useState } from 'react'

import AppHeader from '@components/AppHeader'
import ChatHistoryItem from '@components/ChatHistoryItem'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: number
}

type Conversation = {
  id: string
  title: string
  avatarUrl?: string
  messages: ChatMessage[]
}

const newId = () => {
  // Avoid relying on crypto.randomUUID() availability in all runtimes
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const now = Date.now()
    return [
      {
        id: 'c1',
        title: 'Welcome chat',
        avatarUrl: '/LogoChatrigo3.png',
        messages: [
          {
            id: 'm1',
            role: 'assistant',
            text: 'Hi! Start chatting by typing a message below.',
            createdAt: now,
          },
        ],
      },
      {
        id: 'c2',
        title: 'Project ideas',
        avatarUrl: '/LogoChatrigo1.png',
        messages: [
          {
            id: 'm2',
            role: 'user',
            text: 'Give me 3 project ideas.',
            createdAt: now,
          },
          {
            id: 'm3',
            role: 'assistant',
            text: 'Sure — a chat app, a habit tracker, and a recipe organizer.',
            createdAt: now,
          },
        ],
      },
    ]
  })

  const [activeConversationId, setActiveConversationId] = useState(() =>
    conversations[0]?.id ?? '',
  )

  const [input, setInput] = useState<string>('')

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

  function sendMessage(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed === '' || !activeConversation) return

    const msg: ChatMessage = {
      id: newId(),
      role: 'user',
      text: trimmed,
      createdAt: Date.now(),
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              messages: [...c.messages, msg],
            }
          : c,
      ),
    )
    setInput('')
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
                className="h-10 px-4 bg-orange-400 text-white rounded-lg hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat