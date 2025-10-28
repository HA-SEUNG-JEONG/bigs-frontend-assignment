import BoardDetailClient from "@/components/pages/BoardDetailClient";
import { Board } from "@/lib/types/board";
import type { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const { headers } = await import("next/headers");
    const cookieStore = await headers();
    const cookieHeader = cookieStore.get("cookie");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/boards/${params.id}`,
      {
        headers: {
          ...(cookieHeader && { Cookie: cookieHeader })
        }
      }
    );

    if (res.ok) {
      const board: Board = await res.json();
      return {
        title: `${board.title} | 빅스페이먼츠`
      };
    }
  } catch (error) {
    console.error("메타데이터 생성 중 오류:", error);
  }

  return {
    title: "게시글 상세 | 빅스페이먼츠"
  };
}

export default function BoardDetailPage() {
  return <BoardDetailClient />;
}
