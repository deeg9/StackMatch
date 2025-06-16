import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple passthrough middleware - just logs requests and continues
export function middleware(request: NextRequest) {
  console.log(`🔍 MIDDLEWARE: ${request.method} ${request.url}`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/test-simple-endpoint|api/public-test|api/debug/.*).*)",
  ],
}
