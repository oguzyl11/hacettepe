import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { localeHeader } from "@/lib/locale";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/tr" || pathname.startsWith("/tr/")) {
    const url = request.nextUrl.clone();
    const rest = pathname.slice(3);
    url.pathname = rest.length > 0 ? rest : "/";
    return NextResponse.redirect(url);
  }

  const headers = new Headers(request.headers);
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    headers.set(localeHeader, "en");
    return NextResponse.next({ request: { headers } });
  }

  headers.set(localeHeader, "tr");
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/tr" : `/tr${pathname}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!api|media|_next/static|_next/image|.*\\..*).*)"],
};
