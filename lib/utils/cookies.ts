import { NextResponse } from "next/server";

/**
 * 인증 쿠키를 설정하는 유틸 함수
 */
export const setAuthCookies = (
  response: NextResponse,
  accessToken: string,
  refreshToken?: string
): NextResponse => {
  // accessToken 쿠키 설정 (24시간)
  response.cookies.set("accessToken", accessToken, {
    path: "/",
    maxAge: 86400, // 24시간
    secure: false, // 개발 환경에서는 false
    sameSite: "lax",
    httpOnly: true // XSS 공격 방지
  });

  // refreshToken이 있으면 쿠키 설정 (7일)
  if (refreshToken) {
    response.cookies.set("refreshToken", refreshToken, {
      path: "/",
      maxAge: 604800, // 7일
      secure: false, // 개발 환경에서는 false
      sameSite: "lax",
      httpOnly: true // XSS 공격 방지
    });
  }

  return response;
};

/**
 * 인증 쿠키를 삭제하는 유틸 함수
 */
export const deleteAuthCookies = (response: NextResponse): NextResponse => {
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
};
