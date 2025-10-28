"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { fetchWithAuth } from "@/lib/utils/auth";
import { useRouter } from "next/navigation";

type PostFormData = {
  title: string;
  content: string;
  category: string;
};

export default function WritePostClient() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PostFormData>();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    try {
      const formData = new FormData();

      const requestBlob = new Blob([JSON.stringify(data)], {
        type: "application/json"
      });
      formData.append("request", requestBlob);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/boards`,
        {
          method: "POST",
          body: formData
        }
      );

      if (res.ok) {
        router.push("/");
      } else {
        console.error("글 작성 실패:", res.status);
        alert("글 작성에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("글 작성 중 오류:", error);
      alert("글 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/boards/categories");

        if (res.ok) {
          const data = await res.json();

          const categoryOptions = Object.entries(data).map(([key, value]) => ({
            value: key,
            label: value as string
          }));

          setCategories(categoryOptions);
        } else {
          console.error("카테고리 조회 실패:", res.status);
        }
      } catch (error) {
        console.error("카테고리 조회 중 오류:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 max-w-2xl mx-auto p-4"
    >
      <Input
        className="w-full p-4 text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
        label="제목"
        placeholder="제목을 입력해주세요"
        error={errors.title?.message}
        {...register("title", {
          required: "제목을 입력해주세요",
          minLength: {
            value: 2,
            message: "제목은 2자 이상 입력해주세요"
          },
          maxLength: {
            value: 100,
            message: "제목은 100자 이하로 입력해주세요"
          }
        })}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          내용
        </label>
        <textarea
          className={`w-full h-40 p-4 text-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
            errors.content ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}
          placeholder="내용을 입력해주세요"
          rows={10}
          {...register("content", {
            required: "내용을 입력해주세요",
            minLength: {
              value: 10,
              message: "내용은 10자 이상 입력해주세요"
            }
          })}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.content.message}
          </p>
        )}
      </div>
      <Select
        label="카테고리"
        options={categories}
        error={errors.category?.message}
        {...register("category", {
          required: "카테고리를 선택해주세요"
        })}
      />

      {/* 파일 업로드 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          이미지 (선택사항)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
        />
        {selectedFile && (
          <p className="mt-1 text-sm text-gray-600">
            선택된 파일: {selectedFile.name}
          </p>
        )}
      </div>

      <Button
        isLoading={isSubmitting}
        type="submit"
        className="w-full py-4 text-lg font-medium"
      >
        {isSubmitting ? "저장 중..." : "저장"}
      </Button>
    </form>
  );
}
