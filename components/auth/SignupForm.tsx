"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";

const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식을 입력해주세요"),
    name: z
      .string()
      .min(1, "이름을 입력해주세요")
      .min(2, "이름은 최소 2자 이상이어야 합니다"),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요")
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .regex(/[0-9]/, "숫자를 1개 이상 포함해야 합니다")
      .regex(/[a-zA-Z]/, "영문자를 1개 이상 포함해야 합니다")
      .regex(/[!%*#?&]/, "특수문자(!%*#?&)를 1개 이상 포함해야 합니다"),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"]
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://front-mission.bigs.or.kr";

      const res = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      setError("네트워크 오류가 발생했습니다");
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

      {/* 이름 필드 */}
      <Input
        {...register("name")}
        type="text"
        id="name"
        label="이름"
        placeholder="홍길동"
        error={errors.name?.message}
      />

      {/* 비밀번호 필드 */}
      <Input
        {...register("password")}
        type={showPassword ? "text" : "password"}
        id="password"
        label="비밀번호"
        placeholder="최소 8자, 영문/숫자/특수문자 포함"
        error={errors.password?.message}
        showPasswordToggle
        isPasswordVisible={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      {/* 비밀번호 확인 필드 */}
      <Input
        {...register("confirmPassword")}
        type={showConfirmPassword ? "text" : "password"}
        id="confirmPassword"
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력하세요"
        error={errors.confirmPassword?.message}
        showPasswordToggle
        isPasswordVisible={showConfirmPassword}
        onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      {/* 에러 메시지 */}
      {error && <Alert type="error" message={error} />}

      {/* 성공 메시지 */}
      {success && (
        <Alert
          type="success"
          message="회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다."
        />
      )}

      {/* 제출 버튼 */}
      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading || isSubmitting}
      >
        회원가입
      </Button>
    </form>
  );
};
