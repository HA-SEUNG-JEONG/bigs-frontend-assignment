import WritePostClient from "@/components/pages/WritePostClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "글 작성 | 빅스페이먼츠"
};

export default function WritePostPage() {
  return <WritePostClient />;
}
