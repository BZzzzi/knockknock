import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const JWT_SECRET = process.env.JWT_SECRET_KEY!;

if (!supabaseUrl || !supabaseAnonKey || !JWT_SECRET) {
  throw new Error("Missing required environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    // Supabase에서 사용자 정보 조회
    const { data: users, error } = await supabase
      .from("adminUser")
      .select("username, password, role")
      .eq("username", username)
      .limit(1);

    if (error || !users || users.length === 0) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const user = users[0];

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const expiresIn = 3600; // 1시간
    const isAdmin = user.role === "admin"; // 관리자 여부 판단

    // JWT 생성
    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn });

    // HttpOnly 쿠키 설정
    const response = NextResponse.json({
      message: "Login successful",
      username: user.username,
      isAdmin,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn, // 초 단위
    });

    return response;
  } catch (err) {
    console.error("Error during login:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
