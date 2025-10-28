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
      // 401 에러인 경우 토큰 갱신 시도
      if (response.status === 401) {
        const refreshToken = request.cookies.get("refreshToken")?.value;

        if (refreshToken) {
          try {
            const refreshResponse = await fetch(
              `${externalApiUrl}/auth/refresh`,
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

              // 새로운 토큰으로 재시도
              const retryResponse = await fetch(
                `${externalApiUrl}/boards?page=${page}&size=${size}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${refreshData.accessToken}`,
                    "Content-Type": "application/json"
                  }
                }
              );

              if (retryResponse.ok) {
                const retryData = await retryResponse.json();

                // 새로운 토큰을 쿠키에 저장
                const nextResponse = NextResponse.json(retryData, {
                  status: 200
                });

                nextResponse.cookies.set(
                  "accessToken",
                  refreshData.accessToken,
                  {
                    path: "/",
                    maxAge: 86400, // 24시간
                    secure: false,
                    sameSite: "lax",
                    httpOnly: true
                  }
                );

                if (refreshData.refreshToken) {
                  nextResponse.cookies.set(
                    "refreshToken",
                    refreshData.refreshToken,
                    {
                      path: "/",
                      maxAge: 604800, // 7일
                      secure: false,
                      sameSite: "lax",
                      httpOnly: true
                    }
                  );
                }

                return nextResponse;
              }
            }
          } catch (refreshError) {
            // 토큰 갱신 실패
          }
        }

        // 토큰 갱신 실패 시 쿠키 삭제하고 401 반환
        const errorResponse = NextResponse.json(
          { error: "인증이 만료되었습니다. 다시 로그인해주세요." },
          { status: 401 }
        );

        errorResponse.cookies.delete("accessToken");
        errorResponse.cookies.delete("refreshToken");

        return errorResponse;
      }

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
