import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAINTENANCE_MODE = true;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // allow maintenance page itself
  if (pathname.startsWith("/maintenance")) {
    return NextResponse.next();
  }

  // redirect EVERYTHING else
  if (MAINTENANCE_MODE) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};