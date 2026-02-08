import Link from 'next/link';
import Image from 'next/image';

const Logo = () => {
  return (
    <div className="bg-neutral-50 h-fit">
      <nav className="relative w-auto h-1/8 ml-2 pt-3 pb-3">
        <Link href="/login" className="object-cover">
          <Image 
            src="/LogoChatrigo1.png"
            alt="Logo"
            fill={true}
            className="object-contain"
            />
        </Link>
      </nav>
    </div>
  )
}

export default Logo