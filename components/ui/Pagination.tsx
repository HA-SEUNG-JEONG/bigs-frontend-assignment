"use client";

import { Button } from "@/components/ui/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex justify-center items-center mt-6 space-x-2"
      aria-label="페이지네이션"
    >
      <Button
        variant="secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1 text-sm"
        aria-label="이전 페이지"
      >
        이전
      </Button>
      <span className="text-sm text-gray-600" aria-current="page">
        {currentPage + 1} / {totalPages}
      </span>
      <Button
        variant="secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-1 text-sm"
        aria-label="다음 페이지"
      >
        다음
      </Button>
    </nav>
  );
}
