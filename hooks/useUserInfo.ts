"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Board, BoardListResponse } from "@/lib/types/board";

interface UserInfo {
  name: string;
}

export function useUserInfo() {
  const [userName, setUserName] = useState<string>("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();

  const fetchUserInfo = async () => {
    try {
      setIsLoadingUser(true);
      const res = await fetch("/api/auth/me");

      if (res.ok) {
        const userInfo: UserInfo = await res.json();
        setUserName(userInfo.name || "사용자");
      } else {
        // 401 에러인 경우 로그인 페이지로 리다이렉트
        if (res.status === 401) {
          router.replace("/signin");
        }
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return {
    userName,
    isLoadingUser,
    refetchUserInfo: fetchUserInfo
  };
}
