import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/dashboard")) {
    const authToken = request.cookies.get("Auth")?.value;

    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }



  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
