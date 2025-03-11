import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/utils/verifyToken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized: Token missing" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
  }

  return NextResponse.json({ message: "Authorized", user: decoded });
}
