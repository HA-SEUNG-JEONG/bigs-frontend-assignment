"use client";

import { Button } from "@/components/ui/Button";
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
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800">
            {board.boardCategory}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <time dateTime={board.createdAt}>
            작성일: {new Date(board.createdAt).toLocaleString("ko-KR")}
          </time>
        </div>
      </header>

      <section className="prose max-w-none">
        <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
          {board.content}
        </div>
      </section>

      {board.imageUrl && (
        <section className="mt-6">
          <img
            src={board.imageUrl}
            alt="게시글 이미지"
            className="max-w-full h-auto rounded-lg shadow-sm"
            onError={(e) => handleImageError(e, board.imageUrl)}
          />
        </section>
      )}

      <footer className="mt-8 flex justify-end">
        <Button variant="secondary" onClick={() => router.push("/")}>
          목록으로 돌아가기
        </Button>
      </footer>
    </article>
  );
}
