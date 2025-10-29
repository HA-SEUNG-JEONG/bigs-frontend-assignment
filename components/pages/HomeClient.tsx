"use client";

import { Header } from "@/components/layout/Header";
import { BoardList } from "@/components/pages/BoardList";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useBoards } from "@/hooks/useBoards";

export default function HomeClient() {
  const { userInfo, isLoadingUser } = useUserInfo();
  const { boards, currentPage, totalPages, isLoading, handlePageChange } =
    useBoards();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <Header
        userInfo={userInfo}
        isLoadingUser={isLoadingUser}
      />

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {/* 환영 메시지 */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            {!isLoadingUser && userInfo.name ? (
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    환영합니다, {userInfo.name}님!
                  </h2>
                  {userInfo.username && (
                    <p className="text-sm text-gray-600">
                      <strong>{userInfo.username}</strong> 계정으로
                      로그인하셨습니다
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    게시글을 작성하거나 다른 사용자의 글을 확인해보세요.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            )}
          </div>

          {/* 게시글 목록 */}
          <div className="mt-4 sm:mt-8">
            <BoardList
              boards={boards}
              isLoading={isLoading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
