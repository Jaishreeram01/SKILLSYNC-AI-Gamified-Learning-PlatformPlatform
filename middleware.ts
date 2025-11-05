import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const publicPaths = ["/", "/auth/login", "/auth/signup"]
  const isPublicPath = publicPaths.includes(path)

  // Since we're using localStorage for sessions, we can't check it in middleware
  // Instead, we'll rely on client-side auth checks
  // Public paths are always accessible
  if (isPublicPath) {
    return NextResponse.next()
  }

  // For dashboard routes, the client component will handle redirection
  // if user is not authenticated
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
