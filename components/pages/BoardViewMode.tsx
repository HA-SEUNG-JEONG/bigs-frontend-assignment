"use client";

import { Board } from "@/lib/types/board";
import { useRouter } from "next/navigation";

interface BoardViewModeProps {
  board: Board;
}

const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  imageUrl?: string
) => {
  console.error("이미지 로드 실패:", imageUrl);
  const target = event.currentTarget;
  target.style.display = "none";

  const errorDiv = document.createElement("div");
  errorDiv.className =
    "p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center";
  errorDiv.textContent = "이미지를 불러올 수 없습니다.";
  target.parentNode?.appendChild(errorDiv);
};

export function BoardViewMode({ board }: BoardViewModeProps) {
  const router = useRouter();

  return (
    <article>
      <header className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-words">
            {board.title}
          </h1>
          <span className="inline-flex px-3 py-1 text-xs sm:text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800 self-start sm:self-auto">
            {board.boardCategory}
          </span>
        </div>

        <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4">
          <time dateTime={board.createdAt}>
            작성일: {new Date(board.createdAt).toLocaleString("ko-KR")}
          </time>
        </div>
      </header>

      <section className="prose max-w-none">
        <div className="whitespace-pre-wrap text-sm sm:text-base text-gray-900 leading-relaxed break-words">
          {board.content}
        </div>
      </section>

      {board.imageUrl && (
        <section className="mt-4 sm:mt-6">
          <div className="flex justify-center">
            <img
              src={board.imageUrl}
              alt="게시글 이미지"
              className="max-w-full h-auto max-h-96 object-contain rounded-lg shadow-sm"
              onError={(e) => handleImageError(e, board.imageUrl)}
            />
          </div>
        </section>
      )}
    </article>
  );
}
