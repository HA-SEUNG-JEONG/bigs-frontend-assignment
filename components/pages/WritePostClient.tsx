"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { fetchWithAuth } from "@/lib/utils/auth";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";

type PostFormData = {
  title: string;
  content: string;
  category: string;
};

export default function WritePostClient() {
  const router = useRouter();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PostFormData>();

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

      const res = await fetchWithAuth(`/api/boards`, {
        method: "POST",
        body: formData
      });

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto py-4 sm:py-6 px-4">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            글 작성
          </h1>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5 bg-white rounded-lg shadow p-4 sm:p-6"
        >
          <fieldset className="space-y-4 sm:space-y-5">
            <legend className="sr-only">게시글 작성 폼</legend>

            <Input
              className="w-full p-3 sm:p-4 text-base sm:text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
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

            <Textarea
              label="내용"
              placeholder="내용을 입력해주세요"
              rows={8}
              error={errors.content?.message}
              {...register("content", {
                required: "내용을 입력해주세요",
                minLength: {
                  value: 10,
                  message: "내용은 10자 이상 입력해주세요"
                }
              })}
            />

            <Select
              label="카테고리"
              options={categories}
              error={errors.category?.message}
              disabled={isLoadingCategories}
              {...register("category", {
                required: "카테고리를 선택해주세요"
              })}
            />

            <FileUpload
              label="이미지 (선택사항)"
              accept="image/*"
              selectedFile={selectedFile}
              onFileChange={setSelectedFile}
            />
          </fieldset>

          <Button
            isLoading={isSubmitting}
            type="submit"
            className="w-full py-3 sm:py-4 text-base sm:text-lg font-medium"
            disabled={isLoadingCategories}
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </Button>
        </form>
      </div>
    </main>
  );
}
