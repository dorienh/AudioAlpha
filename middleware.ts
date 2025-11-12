import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // No middleware needed for landing page
  return
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
