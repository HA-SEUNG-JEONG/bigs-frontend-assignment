/**
 * 쿠키에서 특정 이름의 값을 가져옵니다.
 */
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

/**
 * 쿠키에 값을 설정합니다.
 */
export const setCookie = (
  name: string,
  value: string,
  maxAge: number
): void => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; secure; samesite=lax`;
};

/**
 * refreshToken을 사용하여 새로운 accessToken을 발급받습니다.
 */
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getCookie("refreshToken");

  if (!refreshToken) {
    throw new Error("refreshToken이 없습니다.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`토큰 갱신 실패: ${response.status}`);
    }

    const data = await response.json();

    if (!data.accessToken) {
      throw new Error("새로운 accessToken을 받지 못했습니다.");
    }

    // 새로운 accessToken을 쿠키에 저장 (24시간)
    setCookie("accessToken", data.accessToken, 86400);

    // 새로운 refreshToken이 있다면 저장 (7일)
    if (data.refreshToken) {
      setCookie("refreshToken", data.refreshToken, 604800);
    }

    return data.accessToken;
  } catch (error) {
    console.error("토큰 갱신 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 인증이 필요한 API 요청을 보내고, 401 에러 시 자동으로 토큰을 갱신하여 재시도합니다.
 */
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // 쿠키에서 accessToken 가져오기
  const accessToken = getCookie("accessToken");

  if (!accessToken) {
    throw new Error("accessToken이 없습니다.");
  }

  // 기본 헤더 설정
  const defaultHeaders: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`
  };

  // FormData가 아닌 경우에만 Content-Type 추가
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  // 요청 옵션 병합
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, requestOptions);

    // 401 에러가 발생한 경우 토큰 갱신 시도
    if (response.status === 401) {
      console.log("토큰이 만료되었습니다. 토큰을 갱신합니다...");

      try {
        // 토큰 갱신
        const newAccessToken = await refreshAccessToken();

        // 새로운 토큰으로 원래 요청 재시도
        const retryOptions: RequestInit = {
          ...requestOptions,
          headers: {
            ...requestOptions.headers,
            Authorization: `Bearer ${newAccessToken}`
          }
        };

        return await fetch(url, retryOptions);
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);

        // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
        if (typeof window !== "undefined") {
          // 쿠키 삭제
          document.cookie =
            "accessToken=; path=/; max-age=0; secure; samesite=lax";
          document.cookie =
            "refreshToken=; path=/; max-age=0; secure; samesite=lax";

          // 로그인 페이지로 리다이렉트
          window.location.href = "/login";
        }

        throw refreshError;
      }
    }

    return response;
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
};
