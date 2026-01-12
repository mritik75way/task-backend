import jwt from "jsonwebtoken";

export interface AccessTokenPayload {
  id: string;
}
export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export const generateAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "15m"
  });

export const generateRefreshToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d"
  });
