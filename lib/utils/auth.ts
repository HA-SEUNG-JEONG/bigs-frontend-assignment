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

  // 현재 시간보다 30초 전에 만료되는 경우도 만료로 간주 (여유 시간)
  const currentTime = Math.floor(Date.now() / 1000);
  const bufferTime = 30; // 30초

  return decoded.exp <= currentTime + bufferTime;
};

/**
 * refreshToken을 사용하여 새로운 accessToken을 발급받습니다.
 * 주의: httpOnly 쿠키는 클라이언트에서 직접 접근할 수 없으므로 이 함수는 제한적으로 사용됩니다.
 */
export const refreshAccessToken = async (): Promise<string> => {
  // httpOnly 쿠키는 클라이언트에서 직접 접근할 수 없으므로
  // 이 함수는 실제로는 사용되지 않습니다.
  // 대신 서버 사이드에서 토큰 갱신을 처리해야 합니다.
  throw new Error(
    "클라이언트에서 refreshToken에 직접 접근할 수 없습니다. 서버 사이드에서 처리하세요."
  );
};

/**
 * 인증이 필요한 API 요청을 보냅니다.
 * 주의: httpOnly 쿠키를 사용하므로 클라이언트에서 토큰을 직접 관리할 수 없습니다.
 * 서버 사이드에서 토큰 갱신을 처리해야 합니다.
 */
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // httpOnly 쿠키는 클라이언트에서 직접 접근할 수 없으므로
  // 단순히 fetch 요청만 수행합니다.
  // 토큰 갱신은 서버 사이드(middleware)에서 처리됩니다.

  const defaultHeaders: Record<string, string> = {};

  // FormData가 아닌 경우에만 Content-Type 추가
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
};
