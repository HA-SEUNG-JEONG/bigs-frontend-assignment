/**
 * 클라이언트 사이드에서 사용하는 인증이 포함된 fetch wrapper
 * 401 응답 시 자동으로 토큰 갱신을 시도하고 재요청을 수행합니다.
 */

interface FetchWithTokenRefreshOptions extends RequestInit {
  skipTokenRefresh?: boolean; // 토큰 갱신을 건너뛸지 여부
}

/**
 * 토큰 갱신을 시도하는 함수
 */
async function attemptTokenRefresh(): Promise<boolean> {
  try {
    console.log("토큰 갱신 시도 중...");
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include" // 쿠키 포함
    });

    console.log("토큰 갱신 응답:", {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("토큰 갱신 실패:", errorData);
    }

    return response.ok;
  } catch (error) {
    console.error("토큰 갱신 네트워크 오류:", error);
    return false;
  }
}

/**
 * 인증이 필요한 API 호출을 위한 fetch wrapper
 * 401 응답 시 자동으로 토큰 갱신을 시도하고 원래 요청을 재시도합니다.
 */
export async function fetchWithTokenRefresh(
  url: string,
  options: FetchWithTokenRefreshOptions = {}
): Promise<Response> {
  const { skipTokenRefresh = false, ...fetchOptions } = options;

  console.log(`API 요청 시작: ${url}`, { skipTokenRefresh });

  // 첫 번째 요청 시도
  const response = await fetch(url, {
    ...fetchOptions,
    credentials: "include" // 쿠키 포함
  });

  console.log(`API 응답: ${url}`, {
    status: response.status,
    ok: response.ok,
    statusText: response.statusText
  });

  // 401 에러이고 토큰 갱신을 건너뛰지 않는 경우
  if (response.status === 401 && !skipTokenRefresh) {
    console.log("401 에러 감지, 응답 내용 확인 중...");

    // 응답 내용 확인
    let responseData;
    try {
      responseData = await response.clone().json();
    } catch (e) {
      responseData = {};
    }

    // 서버에서 토큰이 갱신되었다고 알려준 경우
    if (responseData.tokenRefreshed) {
      console.log("서버에서 토큰 갱신 완료, 원래 요청 재시도 중...");

      // 원래 요청을 다시 시도 (무한 루프 방지를 위해 skipTokenRefresh: true)
      return fetchWithTokenRefresh(url, {
        ...options,
        skipTokenRefresh: true
      });
    }

    // 일반적인 401 에러인 경우 클라이언트에서 토큰 갱신 시도
    console.log("토큰 만료 감지, 클라이언트에서 갱신 시도 중...");

    // 토큰 갱신 시도
    const refreshSuccess = await attemptTokenRefresh();

    if (refreshSuccess) {
      console.log("토큰 갱신 성공, 원래 요청 재시도 중...");

      // 원래 요청을 다시 시도 (무한 루프 방지를 위해 skipTokenRefresh: true)
      return fetchWithTokenRefresh(url, {
        ...options,
        skipTokenRefresh: true
      });
    } else {
      console.log("토큰 갱신 실패, 원래 401 응답 반환");
      // 토큰 갱신 실패 시 원래 401 응답 반환
      return response;
    }
  }

  return response;
}

/**
 * 인증이 필요하지 않은 API 호출용 fetch wrapper
 */
export async function fetchWithoutAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: "include"
  });
}
