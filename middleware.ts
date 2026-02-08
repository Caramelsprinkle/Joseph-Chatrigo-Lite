import { NextResponse, type NextRequest } from 'next/server'

import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  const pathname = request.nextUrl.pathname
  const isProtected = pathname.startsWith('/chat')

  if (!isProtected) return response

  // Verify session by asking Supabase (updateSession already refreshed cookies).
  const { createServerClient } = await import('@supabase/ssr')
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {
          // no-op here; updateSession already handled setting cookies on response
        },
      },
    },
  )

  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/chat/:path*'],
}
