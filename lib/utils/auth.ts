export const decodeToken = (token: string) => {
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

export const decodeTokenServer = (token: string) => {
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
 * 클라이언트 사이드에서 토큰 만료 여부 확인
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const bufferTime = 30; // 30초

  return decoded.exp <= currentTime + bufferTime;
};

/**
 * 서버 사이드에서 토큰 만료 여부 확인
 */
export const isTokenExpiredServer = (token: string): boolean => {
  const decoded = decodeTokenServer(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const bufferTime = 30; // 30초

  return decoded.exp <= currentTime + bufferTime;
};

export const refreshAccessToken = async (): Promise<string> => {
  throw new Error(
    "클라이언트에서 refreshToken에 직접 접근할 수 없습니다. 서버 사이드에서 처리하세요."
  );
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers
    }
  };

  return await fetch(url, requestOptions);
};
