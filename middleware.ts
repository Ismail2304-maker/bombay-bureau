import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAINTENANCE_MODE = true; // change to false to reopen site

export function middleware(request: NextRequest) {
  if (MAINTENANCE_MODE) {
    if (!request.nextUrl.pathname.startsWith("/maintenance")) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  return NextResponse.next();
}