/**
 * JWT 토큰을 디코딩하여 payload를 반환합니다.
 */
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("토큰 디코딩 실패:", error);
    return null;
  }
};

/**
 * JWT 토큰이 만료되었는지 확인합니다.
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  // 현재 시간보다 5분 전에 만료되는 경우도 만료로 간주 (여유 시간)
  const currentTime = Math.floor(Date.now() / 1000);
  const bufferTime = 5 * 60; // 5분

  return decoded.exp <= currentTime + bufferTime;
};

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
 * 쿠키에 값을 설정합니다. (개선된 버전)
 */
export const setCookie = (
  name: string,
  value: string,
  maxAge: number
): void => {
  // 개발 환경에서는 secure 옵션을 제거하고 httpOnly도 제거
  const isDev = process.env.NODE_ENV === "development";
  
  let cookieString = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
  
  // 프로덕션 환경에서만 secure 옵션 추가
  if (!isDev) {
    cookieString += "; secure";
  }
  
  console.log(`쿠키 설정 시도: ${name}=${value.substring(0, 20)}...`);
  console.log(`쿠키 문자열: ${cookieString}`);
  
  document.cookie = cookieString;
  
  // 설정 후 확인
  const checkValue = getCookie(name);
  console.log(`쿠키 설정 확인: ${name} = ${checkValue ? '설정됨' : '설정 실패'}`);
};

/**
 * 쿠키를 삭제합니다.
 */
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; path=/; max-age=0; secure; samesite=lax`;
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API URL이 설정되지 않았습니다.");
    }

    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken }),
      // 타임아웃 설정 (10초)
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("refreshToken이 만료되었습니다. 다시 로그인해주세요.");
      } else if (response.status >= 500) {
        throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        throw new Error(`토큰 갱신 실패: ${response.status}`);
      }
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

    // 네트워크 에러인지 확인
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("토큰 갱신 요청이 시간 초과되었습니다.");
      }
      throw error;
    }

    throw new Error("토큰 갱신 중 알 수 없는 오류가 발생했습니다.");
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

  // 토큰 만료 검증 (사전 검증)
  if (isTokenExpired(accessToken)) {
    console.log("토큰이 만료되었습니다. 사전에 토큰을 갱신합니다...");

    try {
      const newAccessToken = await refreshAccessToken();

      // 새로운 토큰으로 요청 진행
      const defaultHeaders: Record<string, string> = {
        Authorization: `Bearer ${newAccessToken}`
      };

      if (!(options.body instanceof FormData)) {
        defaultHeaders["Content-Type"] = "application/json";
      }

      const requestOptions: RequestInit = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      };

      return await fetch(url, requestOptions);
    } catch (refreshError) {
      console.error("사전 토큰 갱신 실패:", refreshError);

      // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
      if (typeof window !== "undefined") {
        document.cookie =
          "accessToken=; path=/; max-age=0; secure; samesite=lax";
        document.cookie =
          "refreshToken=; path=/; max-age=0; secure; samesite=lax";
        window.location.href = "/login";
      }

      throw refreshError;
    }
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

    // 401 에러가 발생한 경우 토큰 갱신 시도 (백업 로직)
    if (response.status === 401) {
      console.log("401 에러 발생. 토큰을 갱신합니다...");

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
