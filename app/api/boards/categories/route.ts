import { NextRequest, NextResponse } from "next/server";

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

    // 외부 API로 카테고리 목록 조회 요청
    const externalApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://front-mission.bigs.or.kr";
    const response = await fetch(`${externalApiUrl}/boards/categories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      // 다른 오류의 경우 그대로 전달
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "카테고리 조회에 실패했습니다." },
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
