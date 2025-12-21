import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return NextResponse.next();

  const businessSlug = segments[0];

  if (
    businessSlug.startsWith("_next") ||
    businessSlug === "api" ||
    businessSlug === "favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Proteger admin
  if (pathname.includes("/admin")) { 
    const sessionCookie = req.cookies.get("session");

    if (!sessionCookie) {
      return NextResponse.redirect(
        new URL(`/${businessSlug}/login`, req.url)
      );
    }

    try {
      const session = JSON.parse(decodeURIComponent(sessionCookie.value));
      console.log('sesion: ',session);
      
      const businessSlugFromUrl = pathname.split("/")[1];
      console.log('slug url', businessSlugFromUrl);
      
      if (session.businessSlug !== businessSlugFromUrl) {
        return NextResponse.redirect(
          new URL(`/${businessSlug}/login`, req.url)
        );
      }

    } catch {
      return NextResponse.redirect(
        new URL(`/${businessSlug}/login`, req.url)
      );
    }
  }
  const res = NextResponse.next();
  res.headers.set("x-business-slug", businessSlug);
  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};