import { NextResponse } from "next/server";

/**
 * 공통 헤더 생성 함수
 */
function createHeaders(
  body?: BodyInit | null,
  accessToken?: string
): Record<string, string> {
  const headers: Record<string, string> = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

/**
 * 인증이 필요한 외부 API 요청
 */
export async function fetchWithAuth(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
  const headers = createHeaders(options.body, accessToken);

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  };

  return await fetch(url, requestOptions);
}

/**
 * 인증이 필요하지 않은 외부 API 요청
 */
export async function fetchWithoutAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
  const headers = createHeaders(options.body);

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  };

  return await fetch(url, requestOptions);
}

/**
 * Next.js API 라우트에서 사용하는 공통 응답 처리
 */
export async function handleApiResponse(
  response: Response,
  successMessage?: string,
  errorMessage?: string
): Promise<NextResponse> {
  if (response.ok) {
    try {
      const data = await response.json();
      return NextResponse.json(
        successMessage ? { message: successMessage, ...data } : data,
        { status: response.status }
      );
    } catch (jsonError) {
      // JSON이 아닌 경우 빈 객체로 처리
      return NextResponse.json(
        successMessage ? { message: successMessage } : {},
        { status: response.status }
      );
    }
  }

  // 에러 응답 처리
  try {
    const errorData = await response.json();
    return NextResponse.json(errorData, { status: response.status });
  } catch (jsonError) {
    return NextResponse.json(
      { error: errorMessage || "요청 처리에 실패했습니다." },
      { status: response.status }
    );
  }
}

/**
 * Next.js API 라우트에서 사용하는 에러 응답 처리
 */
export function createErrorResponse(
  error: string,
  status: number = 500
): NextResponse {
  return NextResponse.json({ error }, { status });
}
