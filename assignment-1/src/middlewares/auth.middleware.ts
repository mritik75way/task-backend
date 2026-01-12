import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { findUserById } from '../repositories/user.repository'

export interface AuthRequest extends Request {
  user?: {
    id: string
    roles: string[]
  }
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization
  if (!header) return res.sendStatus(401)

  const token = header.split(' ')[1]
  if (!token) return res.sendStatus(401)

  const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }

  const user = await findUserById(payload.userId)
  if (!user) return res.sendStatus(401)

  req.user = {
    id: user.id,
    roles: user.roles
  }

  next()
}
