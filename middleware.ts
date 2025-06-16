import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple passthrough middleware
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/test-simple-endpoint|api/public-test|api/debug/.*).*)",
  ],
}
