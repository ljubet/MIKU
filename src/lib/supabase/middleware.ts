import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session token on every request. Do NOT add any code between
  // createServerClient and this call — it causes hard-to-debug logout issues.
  await supabase.auth.getClaims()

  // Auth-based redirects go here once login/signup is implemented.
  // Uncomment and adjust when /auth/login exists:
  //
  // const { data } = await supabase.auth.getClaims()
  // const isAuthed = !!data?.claims
  // const isPublicPath =
  //   request.nextUrl.pathname === '/' ||
  //   request.nextUrl.pathname.startsWith('/auth')
  //
  // if (!isAuthed && !isPublicPath) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/auth/login'
  //   return NextResponse.redirect(url)
  // }

  return supabaseResponse
}
