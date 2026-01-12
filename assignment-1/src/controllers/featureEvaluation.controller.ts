import { Request, Response } from 'express'
import { evaluateFeature } from '../services/featureEvaluation.service'
import { asyncHandler } from '../utils/asyncHandler'
import { AuthRequest } from '../middlewares/auth.middleware'

export const evaluateFeatureController = asyncHandler(async (
  req: AuthRequest,
  res: Response
) => {
  const key = req.params.key as string
  const result = await evaluateFeature(key, req.user!)
  res.json(result)
})

