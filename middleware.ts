import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * JWT 토큰을 디코딩하여 payload를 반환합니다. (서버 사이드용)
 */
const decodeToken = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // 패딩 추가
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const jsonPayload = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * JWT 토큰이 만료되었는지 확인합니다. (서버 사이드용)
 */
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  // 현재 시간보다 5분 전에 만료되는 경우도 만료로 간주 (여유 시간)
  const currentTime = Math.floor(Date.now() / 1000);
  const bufferTime = 5 * 60; // 5분

  return decoded.exp <= currentTime + bufferTime;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // accessToken 쿠키 확인
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 토큰이 만료되었는지 확인 (갱신 시도 여부 결정용)
  const isTokenInvalid =
    !accessToken || (accessToken && isTokenExpired(accessToken));

  // 보호된 경로들 (인증이 필요한 경로)
  const protectedPaths = ["/"];

  // 인증이 필요 없는 경로들 (이미 로그인한 사용자는 리다이렉트)
  const authPaths = ["/login", "/signup"];

  // 현재 경로가 보호된 경로인지 확인
  const isProtectedPath = protectedPaths.includes(pathname);

  // 현재 경로가 인증 페이지인지 확인
  const isAuthPath = authPaths.includes(pathname);

  // 보호된 경로에 접근하는데 토큰이 없거나 만료된 경우 갱신 시도
  if (isProtectedPath && isTokenInvalid) {
    // refreshToken이 있으면 토큰 갱신 시도
    if (refreshToken) {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://front-mission.bigs.or.kr";

        const response = await fetch(`${apiUrl}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ refreshToken }),
          // 타임아웃 설정 (10초)
          signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
          const data = await response.json();

          // 새로운 토큰으로 응답 생성
          const res = NextResponse.next();

          // 새 accessToken 설정 (24시간)
          res.cookies.set("accessToken", data.accessToken, {
            path: "/",
            maxAge: 86400,
            secure: false, // 개발 환경에서는 false
            sameSite: "lax",
            httpOnly: true
          });

          // 새 refreshToken 설정 (7일)
          if (data.refreshToken) {
            res.cookies.set("refreshToken", data.refreshToken, {
              path: "/",
              maxAge: 604800,
              secure: false, // 개발 환경에서는 false
              sameSite: "lax",
              httpOnly: true
            });
          }

          return res;
        } else {
          // refreshToken이 만료된 경우 쿠키 삭제
          if (response.status === 401) {
            const res = NextResponse.redirect(new URL("/login", request.url));
            res.cookies.delete("accessToken");
            res.cookies.delete("refreshToken");
            return res;
          }
        }
      } catch (error) {
        // 네트워크 에러인 경우 쿠키 삭제 후 로그인 페이지로
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
        return res;
      }
    }

    // refreshToken이 없거나 갱신 실패 시 로그인 페이지로
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // accessToken이 있고 유효하면 그냥 통과
  if (isProtectedPath && accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
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
