"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { fetchWithAuth } from "@/lib/utils/auth";
import { Board } from "@/lib/types/board";

export default function BoardDetailPage() {
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const boardId = params.id as string;

  // 게시글 상세 조회
  const fetchBoardDetail = async () => {
    try {
      setIsLoading(true);
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}`
      );

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

  useEffect(() => {
    if (boardId) {
      fetchBoardDetail();
    }
  }, [boardId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">게시글을 찾을 수 없습니다.</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
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
              <h1 className="text-2xl font-bold text-gray-900">게시글 상세</h1>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            {/* 게시글 정보 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {board.title}
                </h2>
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800">
                  {board.boardCategory}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>
                  작성일: {new Date(board.createdAt).toLocaleString("ko-KR")}
                </span>
              </div>
            </div>

            {/* 게시글 내용 */}
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                {board.content}
              </div>
            </div>

            {/* 이미지 */}
            {board.imageUrl && (
              <div className="mt-6">
                <img
                  src={board.imageUrl}
                  alt="게시글 이미지"
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* 하단 버튼 */}
            <div className="mt-8 flex justify-end">
              <Button variant="secondary" onClick={() => router.push("/")}>
                목록으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
