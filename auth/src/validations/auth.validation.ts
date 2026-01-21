import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(4)
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});

export const forgotPasswordSchema = z.object({
  email: z.email()
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6)
});
