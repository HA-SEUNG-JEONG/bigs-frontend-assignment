import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/utils/cookies";
import {
  fetchWithoutAuth,
  handleApiResponse,
  createErrorResponse
} from "@/lib/utils/api-client";

interface SigninResponse {
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 외부 API로 로그인 요청
    const response = await fetchWithoutAuth("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });

    if (response.status === 200) {
      let responseData: SigninResponse = {
        accessToken: "",
        refreshToken: ""
      };
      responseData = await response.json();

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
      return handleApiResponse(response, undefined, "로그인에 실패했습니다.");
    }
  } catch (error) {
    console.error("로그인 API 오류:", error);
    return createErrorResponse("서버 오류가 발생했습니다.");
  }
}
