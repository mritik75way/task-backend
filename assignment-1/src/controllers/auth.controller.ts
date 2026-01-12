import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { registerValidation, loginValidation } from '../validations/auth.validation'
import { findUserByEmail, createUser } from '../repositories/user.repository'

export const registerController = async (req: Request, res: Response) => {
  const data = registerValidation.parse(req.body)

  const existing = await findUserByEmail(data.email)
  if (existing) return res.status(409).json({ message: 'USER_EXISTS' })

  const hashed = await bcrypt.hash(data.password, 10)

  const user = await createUser(data.email, hashed, data.roles)

  res.json({ id: user.id, email: user.email, roles: user.roles })
}

export const loginController = async (req: Request, res: Response) => {
  const data = loginValidation.parse(req.body)

  const user = await findUserByEmail(data.email)
  if (!user) return res.status(401).json({ message: 'INVALID_CREDENTIALS' })

  const valid = await bcrypt.compare(data.password, user.password)
  if (!valid) return res.status(401).json({ message: 'INVALID_CREDENTIALS' })

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  )

  res.json({ token })
}
