"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Board, BoardListResponse } from "@/lib/types/board";
import { useToast } from "@/components/ui/ToastProvider";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function HomeClient() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { addToast } = useToast();

  const fetchBoards = async (page: number = 0) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/boards?page=${page}&size=10`);

      if (res.ok) {
        const { content, totalPages, number }: BoardListResponse =
          await res.json();

        setBoards(content);
        setTotalPages(totalPages);
        setCurrentPage(number);
      } else {
        // 401 에러인 경우 로그인 페이지로 리다이렉트
        if (res.status === 401) {
          router.replace("/signin");
        }
      }
    } catch (error) {
      // 게시글 목록 조회 중 오류
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchBoards(newPage);
    }
  };

  const handleBoardClick = (boardId: number) => {
    router.push(`/boards/${boardId}`);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    setIsLoggingOut(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        addToast({
          message: "성공적으로 로그아웃되었습니다.",
          type: "success"
        });

        router.replace("/signin");
      } else {
        addToast({
          message: "로그아웃 중 오류가 발생했습니다.",
          type: "error"
        });
      }
    } catch (error) {
      addToast({
        message: "로그아웃 중 오류가 발생했습니다.",
        type: "error"
      });
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
              <button
                onClick={handleLogoutClick}
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

            {/* 게시글 목록 */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  게시글 목록
                </h2>
                <Button
                  className="px-4 py-2 text-sm font-medium"
                  variant="secondary"
                  onClick={() => router.push("/write-post")}
                >
                  글 작성하기
                </Button>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-600">로딩 중...</p>
                </div>
              ) : boards.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">게시글이 없습니다.</p>
                </div>
              ) : (
                <>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            제목
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            카테고리
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            작성일
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {boards.map((board) => (
                          <tr
                            key={board.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleBoardClick(board.id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {board.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {board.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(board.createdAt).toLocaleDateString(
                                "ko-KR"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-3 py-1 text-sm"
                      >
                        이전
                      </Button>
                      <span className="text-sm text-gray-600">
                        {currentPage + 1} / {totalPages}
                      </span>
                      <Button
                        variant="secondary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className="px-3 py-1 text-sm"
                      >
                        다음
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 로그아웃 확인 모달 */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="로그아웃"
        message="정말로 로그아웃하시겠습니까?"
        confirmText="로그아웃"
        cancelText="취소"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        type="warning"
      />
    </div>
  );
}
