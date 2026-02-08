import Link from 'next/link'
import Image from 'next/image'

const Logo = () => {
  return (
    <header className="bg-neutral-50 border-b border-slate-200">
      <nav className="h-16 px-4 flex items-center">
        <Link href="/login" className="flex items-center gap-3">
          <Image
            src="/LogoChatrigo1.png"
            alt="Chatrigo"
            width={140}
            height={40}
            className="object-contain"
            priority
          />
        </Link>
      </nav>
    </header>
  )
}

export default Logo
