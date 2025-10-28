"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { BoardList } from "@/components/pages/BoardList";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useBoards } from "@/hooks/useBoards";
import { useToast } from "@/components/ui/ToastProvider";

export default function HomeClient() {
  const router = useRouter();
  const { addToast } = useToast();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { userName, isLoadingUser } = useUserInfo();
  const { boards, currentPage, totalPages, isLoading, handlePageChange } =
    useBoards();

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

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleBoardClick = (boardId: number) => {
    router.push(`/boards/${boardId}`);
  };

  const handleWritePost = () => {
    router.push("/write-post");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <Header
        userName={userName}
        isLoadingUser={isLoadingUser}
        isLoggingOut={isLoggingOut}
        onLogoutClick={handleLogoutClick}
      />

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {/* 환영 메시지 */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6"></div>

          {/* 게시글 목록 */}
          <div className="mt-4 sm:mt-8">
            <BoardList
              boards={boards}
              isLoading={isLoading}
              currentPage={currentPage}
              totalPages={totalPages}
              onBoardClick={handleBoardClick}
              onPageChange={handlePageChange}
              onWritePost={handleWritePost}
            />
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
        onCancel={handleCancelLogout}
      />
    </div>
  );
}
