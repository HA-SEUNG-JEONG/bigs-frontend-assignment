import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/utils/cookies";
import {
  fetchWithoutAuth,
  handleApiResponse,
  createErrorResponse
} from "@/lib/utils/api-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { username, password, name, confirmPassword } = body;

    // 외부 API로 회원가입 요청 (confirmPassword 포함 - 외부 API가 필수로 요구함)
    const signupData = { username, password, name, confirmPassword };

    const response = await fetchWithoutAuth("/auth/signup", {
      method: "POST",
      body: JSON.stringify(signupData)
    });

    if (response.status === 200) {
      // 회원가입 성공 시 토큰이 함께 오는 경우 쿠키 설정
      const nextResponse = NextResponse.json(
        { message: "회원가입이 완료되었습니다." },
        { status: 200 }
      );

      return nextResponse;
    } else {
      console.error("회원가입 실패:", response.status, response.statusText);
      return handleApiResponse(response, undefined, "회원가입에 실패했습니다.");
    }
  } catch (error) {
    console.error("회원가입 API 오류:", error);
    return createErrorResponse("서버 오류가 발생했습니다.");
  }
}
