"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Table from "@/app/timetable/page";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await fetch("/api/auth-token", {
          method: "GET",
          credentials: "include", // 쿠키 포함
        });

        if (response.status === 200) {
          setIsAdmin(true); // 인증 성공 시 관리자 권한 부여
        } else {
          router.push("/login"); // 인증 실패 시 로그인 페이지로 리다이렉트
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        router.push("/login"); // 인증 실패 시 로그인 페이지로 리다이렉트
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    verifyAdmin();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // 검증 완료 전 로딩 화면
  }

  return (
    <div>
      <Table isAdmin={isAdmin} /> {/* isAdmin을 Table에 전달 */}
    </div>
  );
}
