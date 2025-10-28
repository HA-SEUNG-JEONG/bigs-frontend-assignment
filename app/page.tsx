import HomeClient from "@/components/pages/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "홈 | 빅스페이먼츠"
};

export default function Home() {
  return <HomeClient />;
}
