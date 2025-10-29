import { NextRequest, NextResponse } from "next/server";
import { isTokenExpiredServer } from "@/lib/utils/auth";

export async function GET(request: NextRequest) {
  try {
    // 쿠키에서 accessToken 가져오기
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 토큰 만료 확인
    if (isTokenExpiredServer(accessToken)) {
      console.log("토큰이 만료됨, 갱신 시도 중...");

      // refreshToken으로 토큰 갱신 시도
      const refreshToken = request.cookies.get("refreshToken")?.value;
      if (!refreshToken) {
        return NextResponse.json(
          { error: "토큰이 만료되었습니다. 다시 로그인해주세요." },
          { status: 401 }
        );
      }

      // 토큰 갱신 요청
      const refreshResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "https://front-mission.bigs.or.kr"
        }/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ refreshToken })
        }
      );

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        console.log("토큰 갱신 성공, 새 토큰으로 재시도");

        // 새로운 토큰으로 응답 생성 (특별한 상태 코드 사용)
        const nextResponse = NextResponse.json(
          {
            error: "토큰이 갱신되었습니다. 다시 시도해주세요.",
            tokenRefreshed: true
          },
          { status: 401 }
        );

        // 새 토큰들을 쿠키에 설정
        nextResponse.cookies.set("accessToken", refreshData.accessToken, {
          path: "/",
          maxAge: 86400,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          httpOnly: true
        });

        nextResponse.cookies.set("refreshToken", refreshData.refreshToken, {
          path: "/",
          maxAge: 604800,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          httpOnly: true
        });

        return nextResponse;
      } else {
        console.log("토큰 갱신 실패");
        return NextResponse.json(
          { error: "토큰이 만료되었습니다. 다시 로그인해주세요." },
          { status: 401 }
        );
      }
    }

    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "10";

    // 외부 API로 게시글 목록 조회 요청
    const externalApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://front-mission.bigs.or.kr";
    const response = await fetch(
      `${externalApiUrl}/boards?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      // 다른 오류의 경우 그대로 전달
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "게시글 목록 조회에 실패했습니다." },
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

export async function POST(request: NextRequest) {
  try {
    // 쿠키에서 accessToken 가져오기
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // FormData를 그대로 외부 API로 전달
    const formData = await request.formData();

    // 외부 API로 게시글 작성 요청
    const externalApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://front-mission.bigs.or.kr";
    const response = await fetch(`${externalApiUrl}/boards`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 201 });
    } else {
      // 다른 오류의 경우 그대로 전달
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "게시글 작성에 실패했습니다." },
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
