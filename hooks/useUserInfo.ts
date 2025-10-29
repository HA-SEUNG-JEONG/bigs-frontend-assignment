"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface UserInfo {
  name: string;
  username: string;
}

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    username: ""
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();

  const fetchUserInfo = async () => {
    try {
      setIsLoadingUser(true);
      const res = await fetch("/api/auth/me");

      if (res.ok) {
        const { name, username }: UserInfo = await res.json();
        setUserInfo({
          name,
          username
        });
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
    userInfo,
    isLoadingUser,
    refetchUserInfo: fetchUserInfo
  };
}
