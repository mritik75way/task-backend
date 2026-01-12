import { z } from 'zod'

export const registerValidation = z.object({
  email: z.email(),
  password: z.string().min(6),
  roles: z.array(z.string())
})

export const loginValidation = z.object({
  email: z.email(),
  password: z.string()
})
