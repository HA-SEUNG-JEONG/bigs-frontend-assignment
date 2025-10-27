"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";

// 로그인 유효성 검사 스키마
const signinSchema = z.object({
  username: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식을 입력해주세요"),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요")
    .min(1, "비밀번호를 입력해주세요")
});

type SigninFormData = z.infer<typeof signinSchema>;

export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: SigninFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const responseData = await res.json();

      if (res.ok) {
        // 토큰을 쿠키에 저장
        if (responseData.accessToken) {
          document.cookie = `accessToken=${responseData.accessToken}; path=/; max-age=86400; secure; samesite=lax`;
        }
        if (responseData.refreshToken) {
          document.cookie = `refreshToken=${responseData.refreshToken}; path=/; max-age=604800; secure; samesite=lax`;
        }

        // 로그인 성공 시 메인 페이지로 리다이렉트
        router.replace("/");
      } else {
        setError(responseData.error || "로그인에 실패했습니다.");
      }
    } catch (error) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 이메일 필드 */}
      <Input
        {...register("username")}
        type="email"
        id="username"
        label="이메일"
        placeholder="example@email.com"
        error={errors.username?.message}
      />

      {/* 비밀번호 필드 */}
      <Input
        {...register("password")}
        type={showPassword ? "text" : "password"}
        id="password"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        error={errors.password?.message}
        showPasswordToggle
        isPasswordVisible={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      {/* 에러 메시지 */}
      {error && <Alert type="error" message={error} />}

      {/* 제출 버튼 */}
      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading || isSubmitting}
      >
        로그인
      </Button>
    </form>
  );
};
