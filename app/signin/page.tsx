import { AuthLayout } from "../../components/layout/AuthLayout";
import { FormHeader } from "../../components/auth/FormHeader";
import { FormFooter } from "../../components/auth/FormFooter";
import { SignInForm } from "../../components/auth/SignInForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | 빅스페이먼츠"
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <FormHeader title="로그인" subtitle="계정에 로그인하세요" />
      <SignInForm />
      <FormFooter
        text="계정이 없으신가요?"
        linkText="회원가입"
        linkHref="/signup"
      />
    </AuthLayout>
  );
}
