import { NextRequest, NextResponse } from "next/server";

const decodeToken = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // 패딩 추가
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const jsonPayload = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

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
    const decoded = decodeToken(accessToken);

    if (!decoded) {
      return NextResponse.json(
        { error: "유효하지 않은 토큰입니다." },
        { status: 401 }
      );
    }

    // 토큰 만료 확인
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp <= currentTime) {
      return NextResponse.json(
        { error: "토큰이 만료되었습니다." },
        { status: 401 }
      );
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
