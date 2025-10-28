"use client";

import { Button } from "@/components/ui/Button";

interface HeaderProps {
  userName: string;
  isLoadingUser: boolean;
  isLoggingOut: boolean;
  onLogoutClick: () => void;
}

export function Header({
  userName,
  isLoadingUser,
  isLoggingOut,
  onLogoutClick
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">
                BIGS Payments
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoadingUser && userName && (
              <span className="text-sm text-gray-600 font-medium">
                안녕하세요, {userName}님
              </span>
            )}
            <button
              onClick={onLogoutClick}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
