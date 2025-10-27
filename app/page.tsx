"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userInfo, setUserInfo] = useState<{
    name?: string;
    username?: string;
  } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // 로그아웃 핸들러
  const handleLogout = () => {
    setIsLoggingOut(true);

    try {
      // 클라이언트 사이드에서 쿠키 삭제
      document.cookie = "accessToken=; path=/; max-age=0; secure; samesite=lax";
      document.cookie =
        "refreshToken=; path=/; max-age=0; secure; samesite=lax";

      // 사용자 정보 초기화
      setUserInfo(null);

      // 로그인 페이지로 리다이렉트
      router.replace("/login");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  BIGS Payments
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                안녕하세요,{" "}
                <span className="font-medium">
                  {userInfo?.name || userInfo?.username}
                </span>
                님
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            {/* 환영 메시지 */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6"></div>

            {/* 사용자 정보 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  사용자 정보
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      이름:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
                      {userInfo?.name || "정보 없음"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      이메일:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
                      {userInfo?.username || "정보 없음"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4"></div>
            </div>

            {/* 기능 카드들 */}
            <div className="mt-8"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
