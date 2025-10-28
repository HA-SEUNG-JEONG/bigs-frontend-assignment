import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 쿠키에서 토큰 확인
    const accessToken = request.cookies.get("accessToken")?.value;

    // 외부 API로 로그아웃 요청 (선택사항 - 서버에서 세션 무효화)
    if (accessToken) {
      try {
        const externalApiUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://front-mission.bigs.or.kr";

        // 외부 API로 로그아웃 요청 (토큰 무효화)
        await fetch(`${externalApiUrl}/auth/logout`, {
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
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (error) {
    // 오류가 발생해도 쿠키는 삭제
    const errorResponse = NextResponse.json(
      { error: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );

    errorResponse.cookies.delete("accessToken");
    errorResponse.cookies.delete("refreshToken");

    return errorResponse;
  }
}


