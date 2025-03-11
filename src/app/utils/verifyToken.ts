// utils/verifyToken.ts
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  role?: string;
}

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    const secret = process.env.JWT_SECRET_KEY as string; // .env에 JWT_SECRET 저장
    return jwt.verify(token, secret) as DecodedToken;
  } catch (err) {
    return null; // 검증 실패 시 null 반환
  }
};
