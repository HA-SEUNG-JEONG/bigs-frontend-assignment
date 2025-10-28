"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { fetchWithAuth } from "@/lib/utils/auth";
import { Board } from "@/lib/types/board";
import { SubmitHandler, useForm } from "react-hook-form";

export default function BoardDetailPage() {
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const params = useParams();
  const boardId = params.id as string;

  type PostFormData = {
    title: string;
    content: string;
    category: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PostFormData>();

  // 게시글 상세 조회
  const fetchBoardDetail = async () => {
    try {
      setIsLoading(true);
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}`
      );

      if (res.ok) {
        const data: Board = await res.json();
        setBoard(data);
        // 폼 데이터 초기화
        reset({
          title: data.title,
          content: data.content,
          category: data.boardCategory || data.category
        });
      } else {
        console.error("게시글 조회 실패:", res.status);
        router.push("/");
      }
    } catch (error) {
      console.error("게시글 조회 중 오류:", error);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리 조회
  const fetchCategories = async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/boards/categories`
      );

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

  // 수정 제출
  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    try {
      const formData = new FormData();

      // JSON 데이터를 Blob으로 변환하여 request 필드에 추가
      const requestBlob = new Blob([JSON.stringify(data)], {
        type: "application/json"
      });
      formData.append("request", requestBlob);

      // 파일이 있으면 file 필드에 추가
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}`,
        {
          method: "PATCH",
          body: formData
          // Content-Type 헤더를 제거 - 브라우저가 자동으로 설정하도록 함
        }
      );

      if (res.ok) {
        // 수정 성공 시 상세 페이지 새로고침
        await fetchBoardDetail();
        setIsEditing(false);
        setSelectedFile(null);
        alert("게시글이 성공적으로 수정되었습니다.");
      } else {
        console.error("게시글 수정 실패:", res.status);
        alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("게시글 수정 중 오류:", error);
      alert("게시글 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    if (boardId) {
      fetchBoardDetail();
      fetchCategories();
    }
  }, [boardId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">게시글을 찾을 수 없습니다.</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="secondary"
                onClick={() => router.push("/")}
                className="mr-4"
              >
                ← 목록으로
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "게시글 수정" : "게시글 상세"}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  수정하기
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedFile(null);
                    // 폼 데이터를 원래 값으로 리셋
                    if (board) {
                      reset({
                        title: board.title,
                        content: board.content,
                        category: board.boardCategory || board.category
                      });
                    }
                  }}
                >
                  취소
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            {isEditing ? (
              /* 수정 모드 */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      errors.content
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
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
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                  {selectedFile && (
                    <p className="mt-1 text-sm text-gray-600">
                      선택된 파일: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                      if (board) {
                        reset({
                          title: board.title,
                          content: board.content,
                          category: board.boardCategory || board.category
                        });
                      }
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="px-6 py-2"
                  >
                    {isSubmitting ? "수정 중..." : "수정 완료"}
                  </Button>
                </div>
              </form>
            ) : (
              /* 보기 모드 */
              <>
                {/* 게시글 정보 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {board.title}
                    </h2>
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {board.boardCategory}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>
                      작성일:{" "}
                      {new Date(board.createdAt).toLocaleString("ko-KR")}
                    </span>
                  </div>
                </div>

                {/* 게시글 내용 */}
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                    {board.content}
                  </div>
                </div>

                {/* 이미지 */}
                {board.imageUrl && (
                  <div className="mt-6">
                    <img
                      src={board.imageUrl}
                      alt="게시글 이미지"
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}

                {/* 하단 버튼 */}
                <div className="mt-8 flex justify-end">
                  <Button variant="secondary" onClick={() => router.push("/")}>
                    목록으로 돌아가기
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
