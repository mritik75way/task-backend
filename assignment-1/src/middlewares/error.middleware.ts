import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'VALIDATION_ERROR',
      errors: err.issues
    })
  }
  console.log(err)
  res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' })
}
