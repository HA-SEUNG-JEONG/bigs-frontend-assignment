import { AuthLayout } from "../../components/layout/AuthLayout";
import { FormHeader } from "../../components/auth/FormHeader";
import { FormFooter } from "../../components/auth/FormFooter";
import { SignupForm } from "../../components/auth/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 | 빅스페이먼츠"
};

export default function SignupPage() {
  return (
    <AuthLayout>
      <FormHeader title="회원가입" subtitle="새 계정을 만들어보세요" />

      <SignupForm />

      <FormFooter
        text="이미 계정이 있으신가요?"
        linkText="로그인"
        linkHref="/signin"
      />
    </AuthLayout>
  );
}
