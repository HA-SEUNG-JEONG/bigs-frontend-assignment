import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // accessToken 쿠키 확인
  const accessToken = request.cookies.get("accessToken")?.value;

  // 보호된 경로들 (인증이 필요한 경로)
  const protectedPaths = ["/"];

  // 인증이 필요 없는 경로들 (이미 로그인한 사용자는 리다이렉트)
  const authPaths = ["/login", "/signup"];

  // 현재 경로가 보호된 경로인지 확인
  const isProtectedPath = protectedPaths.includes(pathname);

  // 현재 경로가 인증 페이지인지 확인
  const isAuthPath = authPaths.includes(pathname);

  // 보호된 경로에 접근하는데 토큰이 없는 경우
  if (isProtectedPath && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 이미 로그인한 사용자가 인증 페이지에 접근하는 경우
  if (isAuthPath && accessToken) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
