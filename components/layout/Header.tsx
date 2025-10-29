"use client";

import { UserInfo } from "@/hooks/useUserInfo";

interface HeaderProps {
  userInfo: UserInfo;
  isLoadingUser: boolean;
  onLogoutClick: () => void;
}

export function Header({
  userInfo,
  isLoadingUser,
  onLogoutClick
}: HeaderProps) {
  return (
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
            {!isLoadingUser && userInfo.name && (
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm text-gray-600 font-medium">
                  안녕하세요, {userInfo.name}님
                </span>
                {userInfo.username && (
                  <span className="text-xs text-gray-500">
                    {userInfo.username}
                  </span>
                )}
              </div>
            )}
            {!isLoadingUser && userInfo.name && (
              <div className="sm:hidden flex flex-col items-end">
                <span className="text-xs text-gray-600 font-medium">
                  {userInfo.name}님
                </span>
                {userInfo.username && (
                  <span className="text-xs text-gray-500">
                    {userInfo.username}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={onLogoutClick}
              className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
