import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware'

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.roles.includes('ADMIN')) {
    return res.sendStatus(403)
  }
  next()
}
