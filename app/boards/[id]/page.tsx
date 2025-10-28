import BoardDetailClient from "@/components/pages/BoardDetailClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "게시글 상세 | 빅스페이먼츠"
};

export default function BoardDetailPage() {
  return <BoardDetailClient />;
}
