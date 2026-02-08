'use client'

import Link from 'next/link'
import Image from 'next/image'

import { logoutAction } from '@/app/(auth)/actions'

const AppHeader = () => {
  return (
    <header className="bg-neutral-50 border-b border-slate-200">
      <nav className="h-16 px-4 flex items-center justify-between gap-4">
        <Link href="/chat" className="flex items-center gap-3">
          <Image
            src="/LogoChatrigo1.png"
            alt="Chatrigo"
            width={140}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="h-10 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold"
          >
            Logout
          </button>
        </form>
      </nav>
    </header>
  )
}

export default AppHeader
