import User, { IUser } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { generateResetToken } from "../utils/resetToken";
import crypto from "crypto";
import { sendEmail } from "../utils/email";

interface AuthInput {
  email: string;
  password: string;
  name?: string;
}

export const registerUser = async (
  data: AuthInput
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("User already exists");

  const hashed = await hashPassword(data.password);
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashed,
  });
  const accessToken = generateAccessToken({ id: user._id.toString() });
  const refreshToken = generateRefreshToken({ id: user._id.toString() });

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const loginUser = async (
  data: AuthInput
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  const user = await User.findOne({ email: data.email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken({ id: user._id.toString() });
  const refreshToken = generateRefreshToken({ id: user._id.toString() });

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) return;

  const { token, hashedToken } = generateResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); 
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `
    <p>You requested a password reset</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link expires in 10 minutes.</p>
  `,
  });

  return token;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) throw new Error("Token invalid or expired");

  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};

export const logoutUser = async (refreshToken?: string) => {
  if (!refreshToken) return;

  const user = await User.findOne({ refreshToken });
  if (!user) return;

  user.refreshToken = undefined;
  await user.save();
};
