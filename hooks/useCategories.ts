"use client";

import { useState, useEffect } from "react";

interface CategoryOption {
  value: string;
  label: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/boards/categories");

      if (res.ok) {
        const data = await res.json();
        const categoryOptions = Object.entries(data).map(([key, value]) => ({
          value: key,
          label: value as string
        }));
        setCategories(categoryOptions);
      } else {
        setError("카테고리 조회에 실패했습니다.");
        console.error("카테고리 조회 실패:", res.status);
      }
    } catch (error) {
      setError("카테고리 조회 중 오류가 발생했습니다.");
      console.error("카테고리 조회 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories
  };
}
