"use client";

import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Board } from "@/lib/types/board";

interface BoardListProps {
  boards: Board[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onBoardClick: (boardId: number) => void;
  onPageChange: (page: number) => void;
  onWritePost: () => void;
}

export function BoardList({
  boards,
  isLoading,
  currentPage,
  totalPages,
  onBoardClick,
  onPageChange,
  onWritePost
}: BoardListProps) {
  if (isLoading) {
    return (
      <section className="text-center py-8" aria-label="로딩 중">
        <div
          className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
          aria-hidden="true"
        ></div>
        <p className="mt-2 text-gray-600">로딩 중...</p>
      </section>
    );
  }

  if (boards.length === 0) {
    return (
      <section className="text-center py-8" aria-label="게시글 목록">
        <p className="text-gray-600">게시글이 없습니다.</p>
      </section>
    );
  }

  return (
    <section aria-label="게시글 목록">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          게시글 목록
        </h2>
        <Button
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium"
          variant="secondary"
          onClick={onWritePost}
        >
          글 작성하기
        </Button>
      </header>

      <div className="space-y-4 sm:hidden">
        {boards.map((board) => (
          <article
            key={board.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
            onClick={() => onBoardClick(board.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onBoardClick(board.id);
              }
            }}
            aria-label={`게시글: ${board.title}`}
          >
            <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
              {board.title}
            </h3>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                {board.category}
              </span>
              <time dateTime={board.createdAt}>
                {new Date(board.createdAt).toLocaleDateString("ko-KR")}
              </time>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden sm:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            제목
          </div>
          <div className="hidden md:block text-xs font-medium text-gray-500 uppercase tracking-wider">
            카테고리
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            작성일
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {boards.map((board) => (
            <article
              key={board.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onBoardClick(board.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onBoardClick(board.id);
                }
              }}
              aria-label={`게시글: ${board.title}`}
            >
              <div className="text-sm font-medium text-gray-900">
                {board.title}
              </div>
              <div className="hidden md:block text-sm text-gray-500">
                {board.category}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(board.createdAt).toLocaleDateString("ko-KR")}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
}
