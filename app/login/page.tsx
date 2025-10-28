import { AuthLayout } from "../../components/layout/AuthLayout";
import { FormHeader } from "../../components/auth/FormHeader";
import { FormFooter } from "../../components/auth/FormFooter";
import { LoginForm } from "../../components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | 빅스페이먼츠"
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <FormHeader
        title="로그인"
        subtitle="계정에 로그인하세요"
        icon={
          <svg
            className="h-6 w-6 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
        }
      />

      <LoginForm />

      <FormFooter
        text="계정이 없으신가요?"
        linkText="회원가입"
        linkHref="/signup"
      />
    </AuthLayout>
  );
}
