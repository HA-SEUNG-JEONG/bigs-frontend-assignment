import { NextRequest, NextResponse } from "next/server";
import { decodeTokenServer, isTokenExpiredServer } from "@/lib/utils/auth";

/**
 * 현재 로그인한 사용자의 정보를 반환합니다.
 */
export async function GET(request: NextRequest) {
  try {
    // httpOnly 쿠키에서 accessToken 추출
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "인증 토큰이 없습니다." },
        { status: 401 }
      );
    }

    // JWT 토큰 디코딩하여 사용자 정보 추출
    const decoded = decodeTokenServer(accessToken);

    if (!decoded) {
      return NextResponse.json(
        { error: "유효하지 않은 토큰입니다." },
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
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
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

        // 새로운 토큰으로 응답 생성
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

    // 사용자 정보 반환 (name 필드가 있는지 확인)
    const userInfo = {
      name: decoded.name || decoded.username || "사용자",
      username: decoded.username || decoded.sub
      // 필요에 따라 다른 필드들도 추가 가능
    };

    return NextResponse.json(userInfo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
