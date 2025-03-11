import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

// 요청의 타입 정의
interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

export async function POST(req: NextRequest) {
  try {
    // 요청 바디 읽기
    const body: EmailRequest = await req.json();

    // 필수 값 확인
    if (!body.to || !body.subject || !body.html) {
      return NextResponse.json(
        { message: "Missing required fields: to, subject, or text" },
        { status: 400 }
      );
    }

    // Nodemailer SMTP 설정
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // TLS 포트
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Gmail 주소
        pass: process.env.EMAIL_PASS, // 앱 비밀번호
      },
    });
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    // 이메일 전송
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // 발신 이메일
      to: body.to, // 수신 이메일
      subject: body.subject, // 제목
      html: body.html, // 내용
    });

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email", error: error.message },
      { status: 500 }
    );
  }
}
