"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Board, BoardListResponse } from "@/lib/types/board";
import { fetchWithTokenRefresh } from "@/lib/utils/client-fetch";

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchBoards = async (page: number = 0) => {
    try {
      setIsLoading(true);
      const res = await fetchWithTokenRefresh(
        `/api/boards?page=${page}&size=10`
      );

      if (res.ok) {
        const { content, totalPages, number }: BoardListResponse =
          await res.json();

        setBoards(content);
        setTotalPages(totalPages);
        setCurrentPage(number);
      } else {
        // 401 에러인 경우 로그인 페이지로 리다이렉트
        if (res.status === 401) {
          router.replace("/signin");
        }
      }
    } catch (error) {
      console.error("게시글 목록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchBoards(newPage);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return {
    boards,
    currentPage,
    totalPages,
    isLoading,
    handlePageChange,
    refetchBoards: fetchBoards
  };
}
