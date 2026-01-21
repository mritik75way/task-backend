import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const refreshTokens = async (token: string) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as { id: string };

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = generateAccessToken({ id: user._id.toString() });
  const newRefreshToken = generateRefreshToken({ id: user._id.toString() });

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user
  };
};
