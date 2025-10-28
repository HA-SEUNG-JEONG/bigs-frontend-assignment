import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/utils/cookies";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 외부 API로 로그인 요청
    const externalApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://front-mission.bigs.or.kr";
    const response = await fetch(`${externalApiUrl}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const responseData = await response.json();

    if (response.ok) {
      // Next.js Response 생성
      const nextResponse = NextResponse.json(
        { message: "로그인 성공" },
        { status: 200 }
      );

      // 쿠키 설정
      if (responseData.accessToken) {
        return setAuthCookies(
          nextResponse,
          responseData.accessToken,
          responseData.refreshToken
        );
      }

      return nextResponse;
    } else {
      return NextResponse.json(
        { error: responseData.error || "로그인에 실패했습니다." },
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
