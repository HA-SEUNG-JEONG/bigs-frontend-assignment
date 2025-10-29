import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies, deleteAuthCookies } from "@/lib/utils/cookies";
import {
  fetchWithoutAuth,
  handleApiResponse,
  createErrorResponse
} from "@/lib/utils/api-client";

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log("토큰 갱신 요청 시작");

    // 쿠키에서 refreshToken 추출
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      console.log("리프레시 토큰이 없음");
      return NextResponse.json(
        { error: "리프레시 토큰이 없습니다." },
        { status: 401 }
      );
    }

    console.log("외부 API로 토큰 갱신 요청 중...");

    // 외부 API로 토큰 갱신 요청
    const response = await fetchWithoutAuth("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken })
    });

    console.log("외부 API 응답:", {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    });

    if (response.ok) {
      const data: RefreshResponse = await response.json();
      console.log("토큰 갱신 성공, 새 쿠키 설정 중...");

      // 새로운 토큰으로 응답 생성
      const nextResponse = NextResponse.json(
        { message: "토큰 갱신 성공" },
        { status: 200 }
      );

      // 새 토큰들을 쿠키에 설정
      return setAuthCookies(nextResponse, data.accessToken, data.refreshToken);
    } else {
      console.log("토큰 갱신 실패");

      // refreshToken이 만료된 경우 쿠키 삭제 후 에러 응답
      if (response.status === 401) {
        console.log("리프레시 토큰 만료, 쿠키 삭제");
        const errorResponse = NextResponse.json(
          { error: "리프레시 토큰이 만료되었습니다." },
          { status: 401 }
        );
        return deleteAuthCookies(errorResponse);
      }

      return handleApiResponse(
        response,
        undefined,
        "토큰 갱신에 실패했습니다."
      );
    }
  } catch (error) {
    console.error("토큰 갱신 API 오류:", error);
    return createErrorResponse("서버 오류가 발생했습니다.");
  }
}
