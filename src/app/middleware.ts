// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/verifyToken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url)); // 로그인 페이지로 리다이렉트
  }

  const decoded = verifyToken(token);

  if (!decoded || decoded.role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url)); // 비인가 접근 방지
  }

  return NextResponse.next(); // 검증 성공 시 요청 계속 진행
}

// Middleware 적용 경로 설정
export const config = {
  matcher: ["/admin/:path*"], // admin 경로에만 Middleware 적용
};
