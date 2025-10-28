import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 쿠키에서 accessToken 가져오기
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const boardId = params.id;

    // 외부 API로 게시글 상세 조회 요청
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const requestUrl = `${externalApiUrl}/boards/${boardId}`;

    const response = await fetch(requestUrl, {
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
      // 에러 응답 상세 로깅
      const errorData = await response.json().catch(() => ({}));

      return NextResponse.json(
        {
          error: errorData.error || "게시글 조회에 실패했습니다.",
          details: errorData,
          status: response.status
        },
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 쿠키에서 accessToken 가져오기
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      console.log("ERROR: No accessToken found in cookies");
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const boardId = params.id;

    const formData = await request.formData();

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    // 외부 API로 게시글 수정 요청
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const requestUrl = `${externalApiUrl}/boards/${boardId}`;

    const response = await fetch(requestUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: formData
    });

    if (response.ok) {
      // 응답이 비어있을 수 있으므로 텍스트로 먼저 읽기
      const responseText = await response.text();

      let data;
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          data = { message: "수정 완료" };
        }
      } else {
        data = { message: "수정 완료" };
      }

      return NextResponse.json(data, { status: 200 });
    } else {
      // 다른 오류의 경우 그대로 전달
      const errorData = await response.json().catch(() => ({}));

      return NextResponse.json(
        { error: errorData.error || "게시글 수정에 실패했습니다." },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 쿠키에서 accessToken 가져오기
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const boardId = params.id;

    // 외부 API로 게시글 삭제 요청
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${externalApiUrl}/boards/${boardId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      return NextResponse.json(
        { message: "게시글이 삭제되었습니다." },
        { status: 200 }
      );
    } else {
      // 다른 오류의 경우 그대로 전달
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "게시글 삭제에 실패했습니다." },
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
