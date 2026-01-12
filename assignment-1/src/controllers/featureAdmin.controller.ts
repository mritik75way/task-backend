import { Request, Response } from 'express'
import {
  createFeatureValidation,
  updateFeatureValidation,
  ruleGroupValidation
} from '../validations/feature.validation'
import {
  createFeature,
  updateFeature,
  updateRuleGroup
} from '../repositories/feature.repository'
import { asyncHandler } from '../utils/asyncHandler'

export const createFeatureController = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const data = createFeatureValidation.parse(req.body)
  const feature = await createFeature(data)
  res.status(201).json(feature)
})

export const updateFeatureController = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const data = updateFeatureValidation.parse(req.body)
  const feature = await updateFeature(req.params.key as string, data)

  if (!feature) {
    return res.status(404).json({ message: 'FEATURE_NOT_FOUND' })
  }

  res.json(feature)
})

export const setRuleGroupController = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const ruleGroup = ruleGroupValidation.parse(req.body)

  const feature = await updateRuleGroup(req.params.key as string, ruleGroup)

  if (!feature) {
    return res.status(404).json({ message: 'FEATURE_NOT_FOUND' })
  }

  res.json(feature)
})
