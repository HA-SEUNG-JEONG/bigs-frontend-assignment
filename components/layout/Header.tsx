"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserInfo } from "@/hooks/useUserInfo";
import { Button } from "../ui/Button";
import { ConfirmModal } from "../ui/ConfirmModal";
import { useToast } from "../ui/ToastProvider";

interface HeaderProps {
  userInfo: UserInfo;
  isLoadingUser: boolean;
}

export function Header({ userInfo, isLoadingUser }: HeaderProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        addToast({
          message: "성공적으로 로그아웃되었습니다.",
          type: "success"
        });

        router.replace("/signin");
      }
    } catch (error) {
      addToast({
        message: "로그아웃 중 오류가 발생했습니다.",
        type: "error"
      });
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  BIGS Payments
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button onClick={handleLogoutClick} variant="danger">
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 로그아웃 확인 모달 */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="로그아웃"
        message="정말로 로그아웃하시겠습니까?"
        confirmText="로그아웃"
        cancelText="취소"
        onConfirm={handleLogout}
        onCancel={handleCancelLogout}
      />
    </>
  );
}
