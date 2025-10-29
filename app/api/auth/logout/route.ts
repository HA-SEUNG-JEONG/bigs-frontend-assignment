import { NextRequest, NextResponse } from "next/server";
import { deleteAuthCookies } from "@/lib/utils/cookies";

export async function POST(request: NextRequest) {
  try {
    // 쿠키에서 토큰 확인
    const accessToken = request.cookies.get("accessToken")?.value;

    if (accessToken) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });
      } catch (error) {
        // 외부 API 로그아웃 실패해도 클라이언트 쿠키는 삭제
      }
    }

    // 응답 생성
    const response = NextResponse.json(
      { message: "로그아웃이 완료되었습니다." },
      { status: 200 }
    );

    // httpOnly 쿠키 삭제
    return deleteAuthCookies(response);
  } catch (error) {
    // 오류가 발생해도 쿠키는 삭제
    const errorResponse = NextResponse.json(
      { error: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );

    return deleteAuthCookies(errorResponse);
  }
}
