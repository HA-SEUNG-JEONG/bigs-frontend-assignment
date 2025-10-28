import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, name } = body;

    // 외부 API로 회원가입 요청
    const externalApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://front-mission.bigs.or.kr";
    const response = await fetch(`${externalApiUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password, name })
    });

    const responseData = await response.json();

    if (response.ok) {
      // 회원가입 성공 시 토큰이 함께 오는 경우 쿠키 설정
      const nextResponse = NextResponse.json(
        { message: "회원가입이 완료되었습니다." },
        { status: 200 }
      );

      // accessToken이 있으면 쿠키 설정 (24시간)
      if (responseData.accessToken) {
        nextResponse.cookies.set("accessToken", responseData.accessToken, {
          path: "/",
          maxAge: 86400, // 24시간
          secure: false, // 개발 환경에서는 false
          sameSite: "lax",
          httpOnly: true // XSS 공격 방지
        });
      }

      // refreshToken이 있으면 쿠키 설정 (7일)
      if (responseData.refreshToken) {
        nextResponse.cookies.set("refreshToken", responseData.refreshToken, {
          path: "/",
          maxAge: 604800, // 7일
          secure: false, // 개발 환경에서는 false
          sameSite: "lax",
          httpOnly: true // XSS 공격 방지
        });
      }

      return nextResponse;
    } else {
      return NextResponse.json(
        { error: responseData.error || "회원가입에 실패했습니다." },
        { status: response.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
