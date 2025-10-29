"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { SubmitHandler, useForm } from "react-hook-form";
import { fetchWithTokenRefresh } from "@/lib/utils/client-fetch";
import { Board } from "@/lib/types/board";
import { useCategories } from "@/hooks/useCategories";

type PostFormData = {
  title: string;
  content: string;
  category: string;
};

interface BoardEditModeProps {
  board: Board;
  onCancel: () => void;
  onSuccess: () => void;
}

export function BoardEditMode({
  board,
  onCancel,
  onSuccess
}: BoardEditModeProps) {
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PostFormData>({
    defaultValues: {
      title: board.title,
      content: board.content,
      category: board.boardCategory || board.category
    }
  });

  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    try {
      const formData = new FormData();

      const requestBlob = new Blob([JSON.stringify(data)], {
        type: "application/json"
      });
      formData.append("request", requestBlob);

      const res = await fetchWithTokenRefresh(`/api/boards/${board.id}`, {
        method: "PATCH",
        body: formData
      });

      if (res.ok) {
        onSuccess();
      } else {
        console.error("게시글 수정 실패:", res.status);
        if (res.status === 401) {
          alert("인증이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/signin";
        } else {
          alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
        }
      }
    } catch (error) {
      console.error("게시글 수정 중 오류:", error);
      alert("게시글 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancel = () => {
    reset({
      title: board.title,
      content: board.content,
      category: board.boardCategory || board.category
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      <fieldset className="space-y-4 sm:space-y-6">
        <legend className="sr-only">게시글 수정 폼</legend>

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
          selectedFile={null}
          onFileChange={() => {}}
        />
      </fieldset>

      <footer className="flex flex-row justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          className="flex-1 sm:flex-none sm:w-auto"
        >
          취소
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="flex-1 sm:flex-none sm:w-auto px-4 sm:px-6 py-2 sm:py-2"
          disabled={isLoadingCategories}
        >
          {isSubmitting ? "수정 중..." : "수정 완료"}
        </Button>
      </footer>
    </form>
  );
}
