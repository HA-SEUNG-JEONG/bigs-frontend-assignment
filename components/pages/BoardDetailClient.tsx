"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Header } from "@/components/layout/Header";
import { BoardViewMode } from "@/components/pages/BoardViewMode";
import { BoardEditMode } from "@/components/pages/BoardEditMode";
import { fetchWithAuth } from "@/lib/utils/auth";
import { Board } from "@/lib/types/board";
import { useToast } from "@/components/ui/ToastProvider";

export default function BoardDetailClient() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.id as string;
  const { addToast } = useToast();

  // 상태 관리
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 데이터 fetching 함수
  const fetchBoardDetail = async () => {
    try {
      setIsLoading(true);
      const res = await fetchWithAuth(`/api/boards/${boardId}`);

      if (res.ok) {
        const data: Board = await res.json();
        setBoard(data);
      } else {
        console.error("게시글 조회 실패:", res.status);
        router.push("/");
      }
    } catch (error) {
      console.error("게시글 조회 중 오류:", error);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  // 삭제 함수
  const handleDeleteBoard = async () => {
    setShowDeleteModal(false);

    try {
      const res = await fetchWithAuth(`/api/boards/${boardId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        addToast({
          message: "게시글이 성공적으로 삭제되었습니다.",
          type: "success"
        });
        router.push("/");
      } else {
        console.error("게시글 삭제 실패:", res.status);
        addToast({
          message: "게시글 삭제에 실패했습니다. 다시 시도해주세요.",
          type: "error"
        });
      }
    } catch (error) {
      console.error("게시글 삭제 중 오류:", error);
      addToast({
        message: "게시글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        type: "error"
      });
    }
  };

  // 편집 관련 핸들러
  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    setIsEditing(false);
    if (board) {
      // 폼 리셋은 부모 컴포넌트에서 처리
    }
  };

  // 삭제 모달 관련 핸들러
  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleCancelDelete = () => setShowDeleteModal(false);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (boardId) {
      fetchBoardDetail();
    }
  }, [boardId]);

  const handleEditSuccess = async () => {
    await fetchBoardDetail();
    cancelEditing();
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <section className="text-center" aria-label="로딩 중">
          <div
            className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
            aria-hidden="true"
          ></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </section>
      </main>
    );
  }

  if (!board) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <section className="text-center" aria-label="게시글 없음">
          <p className="text-gray-600">게시글을 찾을 수 없습니다.</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            목록으로 돌아가기
          </Button>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="secondary"
                onClick={() => router.push("/")}
                className="mr-4"
              >
                ← 목록으로
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "게시글 수정" : "게시글 상세"}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <>
                  <Button variant="primary" onClick={startEditing}>
                    수정하기
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleDeleteClick}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    삭제하기
                  </Button>
                </>
              ) : (
                <Button variant="secondary" onClick={cancelEditing}>
                  취소
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            {isEditing ? (
              <BoardEditMode
                board={board}
                onCancel={cancelEditing}
                onSuccess={handleEditSuccess}
              />
            ) : (
              <BoardViewMode board={board} />
            )}
          </div>
        </div>
      </main>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="게시글 삭제"
        message="정말로 이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteBoard}
        onCancel={handleCancelDelete}
        type="danger"
      />
    </div>
  );
}
