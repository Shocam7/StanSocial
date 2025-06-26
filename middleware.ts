// middleware.ts (place in your project root)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not authenticated, continue normally
  if (!session?.user) {
    return res
  }

  const url = req.nextUrl.clone()
  
  // Skip onboarding check for certain paths
  const skipPaths = ['/onboarding', '/auth', '/api', '/_next', '/favicon.ico']
  if (skipPaths.some(path => url.pathname.startsWith(path))) {
    return res
  }

  try {
    // Check if user has completed onboarding
    const { data: userData, error } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('Middleware error checking onboarding:', error)
      return res
    }

    // If onboarding is not completed, redirect to onboarding
    if (!userData?.onboarding_completed) {
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

  } catch (error) {
    console.error('Middleware error:', error)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}