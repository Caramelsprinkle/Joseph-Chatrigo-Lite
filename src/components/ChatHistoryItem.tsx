import React from 'react'

export type ChatHistoryItemProps = {
  title: string
  preview?: string
  avatarUrl?: string
  /** Optional initials if no avatarUrl is provided */
  initials?: string
  active?: boolean
  onClick?: () => void
}

const getInitials = (title: string) => {
  const parts = title.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const second = parts.length > 1 ? parts[1]?.[0] ?? '' : parts[0]?.[1] ?? ''
  return (first + second).toUpperCase() || 'C'
}

const ChatHistoryItem = ({
  title,
  preview,
  avatarUrl,
  initials,
  active = false,
  onClick,
}: ChatHistoryItemProps) => {
  const fallbackInitials = initials ?? getInitials(title)

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'w-full text-left rounded-lg p-3 transition border ' +
        (active
          ? 'bg-orange-100 border-orange-300'
          : 'bg-white hover:bg-slate-50 border-slate-200')
      }
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={`${title} avatar`}
              className="h-10 w-10 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold border border-slate-200">
              {fallbackInitials}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="font-semibold text-slate-800 truncate">{title}</div>
          {preview ? (
            <div className="text-sm text-slate-500 truncate mt-1">{preview}</div>
          ) : null}
        </div>
      </div>
    </button>
  )
}

export default ChatHistoryItem
